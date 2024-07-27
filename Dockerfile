# syntax=docker/dockerfile:1
FROM python:3.12-slim
WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt
EXPOSE 3000
ENTRYPOINT [ "python" ]

ENV time_zone="Asia/Jerusalem"


CMD [ "app.py" ]
