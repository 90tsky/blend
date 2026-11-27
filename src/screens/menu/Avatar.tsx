// The profile photo, round. With no photo: the name's first letter, or a plain figure before a name is set.
export function Avatar({ name, photo, size }: { name: string; photo: string | null; size: number }) {
  const initial = name.trim().charAt(0).toLocaleUpperCase()
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {photo ? (
        <img src={photo} alt="" width={size} height={size} />
      ) : initial ? (
        initial
      ) : (
        <svg viewBox="0 0 24 24" width={size * 0.5} height={size * 0.5} fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
        </svg>
      )}
    </span>
  )
}

// A picked photo as the profile photo: cropped to a square from its middle and shrunk to 256 × 256 on the device, a
// small JPEG (about 20 KB) that's kept on this phone only.
export async function profilePhoto(file: Blob, side = 256): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const crop = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = side
  canvas.height = side
  canvas.getContext('2d')!.drawImage(bitmap, (bitmap.width - crop) / 2, (bitmap.height - crop) / 2, crop, crop, 0, 0, side, side)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.85)
}
