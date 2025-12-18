$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:${port}/")

try {
    $listener.Start()
    Write-Host "Server listening on http://localhost:${port}/"
} catch {
    Write-Error "Could not start server on port $port. Port might be in use or requires admin privileges."
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".babylon" = "application/json" # Babylon often works well with json
    ".json" = "application/json"
    ".ico"  = "image/x-icon"
}

$basePath = Get-Location

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) { $urlPath = "index.html" }
        
        # Basic directory traversal protection
        if ($urlPath -like "*..*") {
            $response.StatusCode = 403
            $response.Close()
            continue
        }

        $filePath = Join-Path $basePath $urlPath
        
        if (Test-Path $filePath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$extension]
            if ($null -eq $contentType) { $contentType = "application/octet-stream" }
            
            $response.ContentType = $contentType
            # Basic CORS
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        Write-Host "Error processing request: $_"
    }
}
