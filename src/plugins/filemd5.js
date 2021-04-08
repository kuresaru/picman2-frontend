import SparkMD5 from "spark-md5";

const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
const chunkSize = 2097152;

export default function (file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        const chunks = Math.ceil(file.size / chunkSize);
        const spark = new SparkMD5.ArrayBuffer();
        let currentChunk = 0;
        reader.onload = function (e) {
            spark.append(e.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                resolve(spark.end());
            }
        };
        function loadNext() {
            let start = currentChunk * chunkSize;
            let end =
                start + chunkSize >= file.size ? file.size : start + chunkSize;
            reader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
    });
}
