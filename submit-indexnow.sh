#!/bin/bash
states=(california texas florida new-york pennsylvania illinois ohio georgia north-carolina michigan new-jersey virginia washington arizona massachusetts)

urls='['
for state in "${states[@]}"; do
  urls+="\"https://alexchalu.github.io/healthcalcs/state/$state-health-insurance.html\","
done
urls=${urls%,}']'

curl -s -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d "{
    \"host\": \"alexchalu.github.io\",
    \"key\": \"a1b2c3d4e5f6g7h8\",
    \"keyLocation\": \"https://alexchalu.github.io/healthcalcs/a1b2c3d4e5f6g7h8.txt\",
    \"urlList\": $urls
  }"
echo " ✅ Submitted 15 state insurance pages to IndexNow"
