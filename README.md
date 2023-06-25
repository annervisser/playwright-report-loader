Proof of concept of a purely static (front-end) playwright report loader.
It allows uploading a ZIP of a playwright HTML report and displaying it.
The fact that it's fully static means it can easily be hosten on something like github pages (https://annervisser.github.io/playwright-report-loader)

For a more practical solution, upload your reports to an S3-like storage that supports hosting. (make sure you get https, otherwise traces won't work)
