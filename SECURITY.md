# Security Policy

## Supported version

Security reports should target the current `main` branch of Developer OS.

## Reporting a vulnerability

Please do **not** disclose suspected vulnerabilities, credentials, API keys, private URLs, or exploit details in a public GitHub issue.

Report security concerns privately to **itsmebk2007@gmail.com** with the subject line `Developer OS security report`. Include a clear description, affected path or feature, reproduction steps, impact, and any safe remediation suggestion.

The project does not publish a response-time service-level agreement. Reports will be assessed privately, and public disclosure should wait until the maintainer has had an opportunity to investigate and release an appropriate fix.

## Security practices

Developer OS keeps provider credentials server-side, validates tRPC procedure inputs, limits assistant message size, applies contact-form validation and rate limiting, and avoids committing `.env` files. These controls reduce risk but do not replace host-level secret management, dependency updates, or deployment monitoring.
