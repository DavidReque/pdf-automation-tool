import { FileUploadPropsInterface } from "../types/types";
import { Input } from "./ui/input";

function FileUpload({onFileChange}: FileUploadPropsInterface) {
  return (
    <div className="w-max mb-4">
      <Input type="file" 
      accept="application/pdf"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          onFileChange(e.target.files[0])
        }
      }}/>
    </div>
  );
}

export default FileUpload;