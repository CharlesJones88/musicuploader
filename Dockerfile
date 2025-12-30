FROM denoland/deno:latest

COPY deno.json deno.lock /
COPY src /src

RUN deno install --entrypoint src/index.ts

LABEL service="musicuploader"
ENV OTEL_DENO=true
ENV OTEL_EXPORTER_OTLP_ENDPOINT="http://dokploy.local/tempo/v1/traces"
ENV OTEL_SERVICE_NAME="musicuploader"
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
ENV OTEL_LOG_LEVEL=debug
ENV OTEL_EXPORTER_OTLP_LOGS=true


ENTRYPOINT ["deno"]
CMD ["run", "-A", "src/index.ts"]