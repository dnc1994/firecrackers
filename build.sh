#!/bin/bash
# 把 src/ 里的分段拼成单文件 index.html
cd "$(dirname "$0")"
{ cat src/00_head.html; echo '<script type="module">'; cat src/05_pre.js; for f in src/sec_*.js; do cat "$f"; echo; done; cat src/99_tail.html; } > index.html
echo "index.html: $(wc -c < index.html) bytes"
