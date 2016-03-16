import csv
import sys
import hashlib

with open(sys.argv[1], 'r') as csvfile:
    reader = csv.reader(csvfile)
    for row in reader:
        h = hashlib.sha256()
        h.update(row[1])
        print '    "%s",' % h.hexdigest()
