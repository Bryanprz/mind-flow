# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "turbo_stream_actions"
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "cally", to: "vendor/cally.js", preload: true
pin "sortablejs" # @1.15.6
