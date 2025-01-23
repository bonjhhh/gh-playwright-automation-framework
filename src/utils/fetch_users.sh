#!/bin/bash

# Initialize variables
page=1
total_pages=1
output_file="./src/utils/users_list.txt"  # Output file inside utils folder

# Create or clear the output file before writing
echo "Listing all users from Reqres API" > $output_file
echo "----------------------------------" >> $output_file

# Loop through the pages until all users are fetched
while [ $page -le $total_pages ]
do
  echo "Fetching users from page $page"

  # Fetch data from the API for the current page
  response=$(curl -s "https://reqres.in/api/users?page=$page")
  
  # Parse total_pages using grep and sed
  total_pages=$(echo $response | grep -o '"total_pages":[0-9]*' | sed 's/"total_pages"://')

  # Ensure total_pages is a valid number
  if [ -z "$total_pages" ] || [ "$total_pages" -lt 1 ]; then
    echo "Error: Could not retrieve total_pages from the API response."
    exit 1
  fi

  # Extract user details and append to the output file using grep and sed
  echo "Page $page:" >> $output_file
  echo $response | grep -o '"data":\[[^]]*\]' | sed 's/"data":\[\([^]]*\)\]/\1/' | tr -d '{}' | tr ',' '\n' | sed 's/"//g' | sed 's/  / /g' >> $output_file
  echo "----------------------------------" >> $output_file

  # Increment page number for the next loop
  ((page++))
done

echo "All users have been listed in $output_file."