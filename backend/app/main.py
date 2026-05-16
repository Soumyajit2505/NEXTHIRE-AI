from fastapi import FastAPI

app = FastAPI(title="NextHire AI Backend")

@app.get("/")
def home():
    return {"message": "NextHire AI Backend Running Successfully"}