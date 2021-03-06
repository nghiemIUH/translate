from django.shortcuts import render
from django.views import View
from django.http import HttpResponse, JsonResponse
import tensorflow as tf
import pickle
from . import translation
import os

# Create your views here.

BATCH_SIZE = 64
embedding_dim = 100
units = 1024

with open('app/model/vocab.pkl', 'rb') as f:
    inp_lang, targ_lang = pickle.load(f)

with open('app/model/embedding_vector.pkl', 'rb') as f:
    embedding_matrix_en, embedding_matrix_vi = pickle.load(f)


vocab_inp_size = len(inp_lang.word_index)+1
vocab_tar_size = len(targ_lang.word_index)+1


encoder = translation.Encoder(
    vocab_inp_size, embedding_dim, units, BATCH_SIZE, embedding_matrix_en)
decoder = translation.Decoder(
    vocab_tar_size, embedding_dim, units, BATCH_SIZE, embedding_matrix_vi)


optimizer = tf.keras.optimizers.Adam()
checkpoint_dir = './app/model'
checkpoint_prefix = os.path.join(checkpoint_dir, "ckpt")
checkpoint = tf.train.Checkpoint(optimizer=optimizer,
                                 encoder=encoder,
                                 decoder=decoder)
checkpoint.restore(tf.train.latest_checkpoint(checkpoint_dir))


class TranslateView(View):
    def get(self, request):
        return render(request, 'index.html')

    def post(self, request):
        text = request.POST['text']
        try:
            text = translation.translate(
                text, inp_lang, targ_lang, encoder, decoder)[0]
        except:
            text = '...'
        return JsonResponse({'response': text})
