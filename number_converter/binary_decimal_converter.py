from sys import argv

def bin2dec(binary):
	decimal = 0
	for bit in binary[1:]:
		decimal = decimal * 2 + int(bit)
	print(decimal)

def dec2bin(decimal):
	binary = ''
	while decimal > 1:
		binary = str(decimal % 2) + binary
		decimal = int(decimal / 2)
	print('1' + binary)

def is_valid_bin(binary):
	try:
		if binary[0] != 'b':
			return False
		for bit in binary[1:]:
			if int(bit) != 0 and int(bit) != 1:
				return False
		return True
	except:
		return False

if is_valid_bin(argv[1]):
	bin2dec(argv[1])
elif argv[1].isnumeric():
	dec2bin(int(argv[1]))
else:
	print('Invalid binary or decimal number given')