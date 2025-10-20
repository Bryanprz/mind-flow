// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "./application"
import { lazyLoadControllersFrom } from "@hotwired/stimulus-loading"

// Use lazy loading to reduce log noise - controllers load on demand
lazyLoadControllersFrom("controllers", application)
