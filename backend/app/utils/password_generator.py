import random
import string


def generate_temp_password():

    letters = string.ascii_letters
    digits = string.digits

    password = (
        ''.join(random.choice(letters)
        for _ in range(5))
        +
        ''.join(random.choice(digits)
        for _ in range(3))
    )

    return password