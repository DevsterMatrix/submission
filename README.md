# SUBMISSION

## Api integration:

You can search for any medicine and the api will fetch after you stop typing for 400ms so that its not spamming the api.

The results are shown as clickable links which will take you to the said medicine's details.

## Optimization:

I have used debounce so that the api is not called on every keystroke.

I have also used AbortController to cancel the previous request if the user searches something else.

I have added caching so if the same medicine is searched again, it doesn't have to call the api again.

## Medicine details:

The medicine details page shows the information received from the api in different sections.

Some important sections like warnings, adverse reactions, dosage and purpose have different colors to make them easier to identify.
