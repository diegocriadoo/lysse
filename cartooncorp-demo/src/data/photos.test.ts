import { describe, expect, it } from "vitest";
import { parsePhotoName, productPhotos } from "./photos";

describe("fotos de producto", () => {
  it("interpreta el nombre de archivo", () => {
    expect(parsePhotoName("38490")).toEqual({ id: "38490", order: 1 });
    expect(parsePhotoName("38490__2")).toEqual({ id: "38490", order: 2 });
    expect(parsePhotoName("d-op-01")).toEqual({ id: "d-op-01", order: 1 });
    expect(parsePhotoName("d-op-01__3")).toEqual({ id: "d-op-01", order: 3 });
  });

  it("todas las fotos registradas tienen crédito y licencia", () => {
    for (const photos of Object.values(productPhotos)) for (const p of photos) expect(p.credit && p.license, p.src).toBeTruthy();
  });
});
