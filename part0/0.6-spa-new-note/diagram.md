```mermaid
sequenceDiagram
    participant BROWSER
    participant SERVER
    Note over BROWSER: User clicks "Save" to submit the form
    Note over BROWSER: Browser prevents reload and renders the updated list
    Note over BROWSER: Form data is sent
    BROWSER->>SERVER: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note over SERVER: Server updates notes
    SERVER-->>BROWSER: 201 Created
```