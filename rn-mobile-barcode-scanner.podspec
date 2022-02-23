require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = package["version"]
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]

  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "10.0" }
  s.source                  = { :git => "https://github.com/Dynamsoft/RN-mobile-barcode-scanner.git", :tag => "#{s.version}" }
  s.source_files            = "ios/RN/**/*.{h,m}"
  s.requires_arc            = true
  s.module_name             = "RNCamera"
  s.header_dir              = "RNCamera"
  s.dependency 'DynamsoftBarcodeReader', '= 8.9.1'

  s.dependency "React"
end
