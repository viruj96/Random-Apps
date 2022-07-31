from argparse import ArgumentParser
from random import choice
from string import ascii_uppercase
from sys import argv

DIFF = 65

class StringError(Exception):
	pass

class CipherError(Exception):
	pass

def cipher(text):
	try:
		if not text.isalpha():
			raise StringError
		text = text.upper()
		key = generate_key(text)
		encryption = ''
		for i in range(len(key)):
			Ki = ord(key[i]) - DIFF
			Pi = ord(text[i]) - DIFF
			Ei = (Pi + Ki) % 26
			encryption += chr(Ei + DIFF)
		return key, encryption
	except StringError:
		print('Cannot encrypt message; should contain only alphabet')

def decipher(encryption, key):
	try:
		if not encryption.isalpha() or not key.isalpha():
			raise StringError
		if len(key) != len(encryption):
			raise CipherError
		encryption = encryption.upper()
		key = key.upper()
		text = ''
		for i in range(len(key)):
			Ki = ord(key[i]) - DIFF
			Ei = ord(encryption[i]) - DIFF
			Di = (Ei - Ki + 26) % 26
			text += chr(Di + DIFF)
		return text
	except StringError:
		print('Cannot decrypt message; should contain only alphabet')
	except CipherError:
		print('Invalid encrypted message and key')

def generate_key(text):
	return ''.join(choice(ascii_uppercase) for _ in range(len(text)))

parser = ArgumentParser(prog='Vigenere Cipher', description='Encrypt or decrypt text using Vignere cipher algorithm')
parser.add_argument('text', metavar='P', type=str, help='Plain text/encrypted message')
parser.add_argument('key', metavar='K', type=str, nargs='?', help='Cipher key')
parser.add_argument('-E', dest='cipher', action='store_const', const=cipher, help='Encrypt message')
parser.add_argument('-D', dest='decipher', action='store_const', const=decipher, help='Decrypt message using key')

args = parser.parse_args(argv[1:])

if args.cipher:
	key, encryption = args.cipher(args.text)
	print('Encrypted message: %s\nKey: %s' % (encryption, key))
elif args.decipher:
	text = args.decipher(args.text, args.key)
	print('Decrypted message: %s' % text)