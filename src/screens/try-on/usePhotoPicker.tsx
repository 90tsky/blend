import { useRef, type ChangeEvent } from 'react'
import { preparePhoto } from '../../services/tryOn'
import { useTryOn } from './flow'

// CHOOSE A PHOTO: the phone's own photo picker. The photo is shrunk on the device and goes to "Looks good?".
export function usePhotoPicker() {
  const { setPhoto, setRoute, go } = useTryOn()
  const ref = useRef<HTMLInputElement>(null)

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // so the same photo can be picked again
    if (!file) return
    setPhoto(await preparePhoto(file).catch(() => file))
    setRoute('photo')
    go('preview')
  }

  return {
    open: () => ref.current?.click(),
    input: <input ref={ref} type="file" accept="image/*" hidden onChange={onChange} />,
  }
}
