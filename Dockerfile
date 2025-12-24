FROM denoland/deno:latest

COPY deno.json deno.lock /
COPY src /src

RUN deno install --entrypoint src/index.ts

ENV OTEL_DENO=true
ENV OTEL_EXPORTER_OTLP_ENDPOINT="http://dokploy.local/tempo"
ENV OTEL_SERVICE_NAME="musicuploader"
ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf

ENTRYPOINT ["deno"]
CMD ["run", "-A", "src/index.ts"]