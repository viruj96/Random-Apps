from enum import Enum
from itertools import tee, islice, chain

def previous_and_next(some_iterable):
    prevs, items, nexts = tee(some_iterable, 3)
    prevs = chain([None], prevs)
    nexts = chain(islice(nexts, 1, None), [None])
    return zip(prevs, items, nexts)

class Roman(Enum):
	I = 1
	V = 5
	X = 10
	L = 50
	C = 100
	D = 500
	M = 1000

roman_numbers = ['LXXIII', 'MXLV', 'CIV', 'DCLXXIV', 'XLVIII', 'KBKJKNJ', 'ix', 'vc', 'XC']
decimal_numbers = []

for number in roman_numbers:
	try:
		decimal_number = 0
		for prev, curr, next in previous_and_next(number.upper()):
			if next != None and Roman[next].value / Roman[curr].value > 10:
				raise
			elif next != None and Roman[curr].value < Roman[next].value:
				decimal_number += Roman[next].value - Roman[curr].value
			elif prev != None and Roman[curr].value > Roman[prev].value:
				continue
			else:
				decimal_number += Roman[curr].value
		decimal_numbers.append(decimal_number)
	except:
		print(number + " is an invalid Romand Number")
		decimal_numbers.append(None)

print(roman_numbers)
print(decimal_numbers)

none_indices = [i for i, val in enumerate(decimal_numbers) if val == None]
valid_roman_numbers = [val for i, val in enumerate(roman_numbers) if i not in none_indices]
decimal_numbers = [x for x in decimal_numbers if x is not None]

roman_numbers = []
for number in decimal_numbers:
	roman_number = ''
	while number - 1000 >= 0:
		number -= 1000
		roman_number += 'M'
	if number - 900 >= 0:
		number -= 900
		roman_number += 'CM'
	if number - 500 >= 0:
		number -= 500
		roman_number += 'D'
	if number - 400 >= 0:
		number -= 400
		roman_number += 'CD'
	while number - 100 >= 0:
		number -= 100
		roman_number += 'C'
	if number - 90 >= 0:
		number -= 90
		roman_number += 'XC'
	if number - 50 >= 0:
		number -= 50
		roman_number += 'L'
	if number - 40 >= 0:
		number -= 40
		roman_number += 'XL'
	while number - 10 >= 0:
		number -= 10
		roman_number += 'X'
	if number - 9 >= 0:
		number -= 9
		roman_number += 'IX'
	if number - 5 >= 0:
		number -= 5
		roman_number += 'V'
	if number - 4 >= 0:
		number -= 4
		roman_number += 'IV'
	while number - 1 >= 0:
		number -= 1
		roman_number += 'I'
	roman_numbers.append(roman_number)

print(valid_roman_numbers)
print(decimal_numbers)
print(roman_numbers)
