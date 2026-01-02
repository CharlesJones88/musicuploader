FROM denoland/deno:latest

COPY deno.json deno.lock /
COPY src /src

RUN deno install --entrypoint src/index.ts

LABEL service="musicuploader"
ENV OTEL_DENO=true
ENV OTEL_SERVICE_NAME="musicuploader"

ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="http://tempo:4318/v1/traces"

ENTRYPOINT ["deno"]
CMD ["run", "-A", "src/index.ts"]