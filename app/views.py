import json
from django.shortcuts import render
from django.views import View
import tensorflow as tf
import pickle
from django.http import HttpResponse
from .translate import Transformer, predict, CustomSchedule, decode, preprocess
# Create your views here.
num_layers = 4
d_model = 300
dff = 512
num_heads = 6
dropout_rate = 0.2
vocab_ipt_size = 42589
vocab_opt_size = 31423

with open('app/models/opt_i2w.pkl', 'rb') as f:
    i2w = pickle.load(f)

with open('app/models/ipt_w2i.pkl', 'rb') as f:
    w2i = pickle.load(f)

transformer = Transformer(num_layers=num_layers, d_model=d_model, num_heads=num_heads, dff=dff,
                          input_vocab_size=vocab_ipt_size, target_vocab_size=vocab_opt_size,
                          pe_input=vocab_ipt_size,
                          pe_target=vocab_opt_size,
                          rate=dropout_rate)
optimizer = tf.keras.optimizers.Adam(CustomSchedule(d_model), beta_1=0.9, beta_2=0.98,
                                     epsilon=1e-9)
checkpoint_path = "app/models/checkpoint"

ckpt = tf.train.Checkpoint(transformer=transformer,
                           optimizer=optimizer)

ckpt_manager = tf.train.CheckpointManager(ckpt, checkpoint_path, max_to_keep=5)

if ckpt_manager.latest_checkpoint:
    ckpt.restore(ckpt_manager.latest_checkpoint)


class TranslateView(View):
    def get(self, request):
        return render(request, 'index.html')

    def post(self, request):
        data = request.POST['value']
        data = preprocess(data)
        try:
            pred = predict(data, w2i, transformer)
        except:
            return HttpResponse(json.dumps({'data': '...'}), content_type="application/json")

        result = decode(i2w, [i for i in pred.numpy()[0]])
        while '_' in result:
            result = result.replace('_', ' ')
        return HttpResponse(json.dumps({'data': result}), content_type="application/json")
