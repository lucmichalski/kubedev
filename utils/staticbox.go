package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gobuffalo/packr"
)

// Serve returns a middleware handler that serves static files from packr box
func Serve(urlPrefix string, box packr.Box) gin.HandlerFunc {
	fileserver := http.FileServer(box)
	if urlPrefix != "" {
		fileserver = http.StripPrefix(urlPrefix, fileserver)
	}
	return func(c *gin.Context) {
		if box.Has(c.Request.URL.Path) {
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	}
}

// RedirectIndex returns a middleware handler that serves redirects to /
func RedirectIndex() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/ui")
		c.Abort()
	}
}
