require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = package["version"]
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]

  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "10.0" }
  s.source                  = { :git => "https://github.com/Dynamsoft/capture-vision-react-native.git", :tag => "#{s.version}" }
  s.source_files            = "ios/RNDynamsoftCaptureVision/**/*.{h,m}"
  s.requires_arc            = true
  s.module_name             = "RNDynamsoftCaptureVision"
  s.header_dir              = "RNDynamsoftCaptureVision"
  s.dependency 'DynamsoftCameraEnhancer', '= 2.3.1'
  s.dependency 'DynamsoftBarcodeReader', '= 9.2.11'

  s.dependency "React"
end
