from lorem_text import lorem
from pyperclip import copy
from sys import argv

try:
	if len(argv) == 1 or argv[1] == '1':
		dummy = lorem.paragraph()
	else:
		dummy = lorem.paragraphs(int(argv[1]))

	copy(dummy)
	print(dummy)
except ValueError:
	print('Invalid number of paragraphs')