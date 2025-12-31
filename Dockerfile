FROM denoland/deno:latest

COPY deno.json deno.lock /
COPY src /src

RUN deno install --entrypoint src/index.ts

LABEL service="musicuploader"
ENV OTEL_DENO=true
ENV OTEL_LOG_LEVEL=debug
ENV OTEL_EXPORTER_OTLP_ENDPOINT="http://tempo:4318"
ENV OTEL_SERVICE_NAME="musicuploader"

ENTRYPOINT ["deno"]
CMD ["run", "-A", "src/index.ts"]