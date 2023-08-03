import * as jwt from "jwt-simple";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

export function encodeResp(obj: any) {
    return jwt.encode(obj, process.env.ETK!, "HS256");
};

export async function decodeResp(tk: string) {
    return jwt.decode(tk, process.env.ETK!, false, "HS256");
};

export function compressImg(imgn: any, quality: number): Promise<any> {
    return new Promise<any>((resolve) => {
        const $canvas = document.createElement("canvas");
        const img = new Image();
        img.onload = () => {
            $canvas.width = img.width;
            $canvas.height = img.height;
            $canvas.getContext("2d")!.drawImage(img, 0, 0);
            $canvas.toBlob((blob) => {
                if (blob !== null) {
                    resolve(blob);
                }
            },
                "image/jpeg",
                quality / 100
            );
        };
        img.src = URL.createObjectURL(imgn);
    });
};
