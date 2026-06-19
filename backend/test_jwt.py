from app.core.jwt import create_access_token

token = create_access_token(
    {
        "sub": "test@gmail.com"
    }
)

print(token)