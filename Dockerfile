FROM node:lts-slim AS build

ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_HOME="/pnpm"
RUN corepack enable