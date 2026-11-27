import { Group, MenuPage, OutRow } from './List'

// Menu › About blend: what blend is, who made it, and which version is running (it used to sit under the menu, to
// tell versions apart while testing on a phone).
export function About() {
  return (
    <MenuPage title="About blend" subtitle="A capsule wardrobe shop.">
      <div className="prose">
        <p>
          Every top in blend goes with every bottom. Shop by event, put the pieces in your <b>change room</b> and mix them there before you buy.
        </p>
        <p>Fewer pieces, more outfits: three tops and two bottoms already make six.</p>
        <p>
          blend is a design project by Chris (Christian Marchew), designed in Figma and built as a working app. It isn’t a real shop yet, so nothing you order is charged
          or sent.
        </p>
      </div>

      <Group label="Links" note={`Version ${__BUILD__}`}>
        <OutRow href="https://christian-marchew.com/" label="Chris’s portfolio" detail="christian-marchew.com" />
      </Group>
    </MenuPage>
  )
}
