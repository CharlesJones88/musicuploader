FROM denoland/deno:latest

COPY deno.json deno.lock /
COPY src /src

RUN deno install --entrypoint src/index.ts

LABEL service="musicuploader"
ENV OTEL_DENO=true
ENV OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="http://dokploy.local/tempo/v1/traces"
ENV OTEL_SERVICE_NAME="musicuploader"

ENTRYPOINT ["deno"]
CMD ["run", "-A", "src/index.ts"]