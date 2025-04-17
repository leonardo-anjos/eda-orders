#!/bin/bash

# generate a random number within a range
generate_random_number() {
  echo $(( RANDOM % $1 ))
}

# generate a random userId
generate_random_user_id() {
  echo "user$(generate_random_number 1000)"
}

# generate a random item
generate_random_item() {
  local items=("pen" "book" "notebook" "laptop" "phone" "mouse")
  echo "${items[$(generate_random_number ${#items[@]})]}"
}

# generate a random total (as a float with 2 decimal places)
generate_random_total() {
  integer_part=$((RANDOM % 100))       # 0 - 99
  decimal_part=$((RANDOM % 100))       # 0 - 99
  printf "%d.%02d" "$integer_part" "$decimal_part"
}

# check if number of calls is provided
if [ -z "$1" ]; then
  echo "usage: $0 <number_of_calls>"
  exit 1
fi

NUM_CALLS=$1

# loop to make API calls
for (( i=1; i<=NUM_CALLS; i++ ))
do
  USER_ID=$(generate_random_user_id)
  ITEM1=$(generate_random_item)
  ITEM2=$(generate_random_item)
  TOTAL=$(generate_random_total)

  echo "[$i/$NUM_CALLS] sending order for $USER_ID with items [$ITEM1, $ITEM2] and total $TOTAL"

  curl --silent --location 'http://localhost:3000/orders' \
    --header 'Content-Type: application/json' \
    --data-raw "{
      \"userId\": \"$USER_ID\",
      \"items\": [\"$ITEM1\", \"$ITEM2\"],
      \"total\": $TOTAL
    }"

  echo -e "\n"
  sleep 1
done
