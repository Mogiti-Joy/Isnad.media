"""Local preview server for the Isnad Media site.

Python's built-in `http.server` cannot send part of a file, which Safari needs
before it will play video. This adds byte-range support so the Stories videos
play in every browser.

Run:   python3 serve.py          (or: python3 serve.py 8080 for another port)
Open:  http://localhost:8000
Stop:  Ctrl + C
"""
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self._remaining = None
        rng = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not rng or not os.path.isfile(path):
            return super().send_head()

        size = os.path.getsize(path)
        m = re.fullmatch(r"bytes=(\d*)-(\d*)", rng.strip())
        if not m or m.groups() == ("", ""):
            return super().send_head()
        first, last = m.groups()
        if first == "":
            start, end = max(0, size - int(last)), size - 1
        else:
            start, end = int(first), min(int(last) if last else size - 1, size - 1)
        if start > end:
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.end_headers()
            return None

        f = open(path, "rb")
        f.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        self._remaining = end - start + 1
        return f

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        # Always check for a newer file, so edits show up on a normal reload.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def copyfile(self, source, outputfile):
        try:
            if self._remaining is None:
                return super().copyfile(source, outputfile)
            while self._remaining > 0:
                chunk = source.read(min(64 * 1024, self._remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                self._remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError):
            pass  # the browser stopped reading, e.g. when seeking in a video


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Isnad Media is running at http://localhost:{port}  (press Ctrl+C to stop)")
    ThreadingHTTPServer(("127.0.0.1", port), RangeHandler).serve_forever()
