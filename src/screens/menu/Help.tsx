import { Group, MenuPage, OutRow } from './List'

// Questions and a way to write to the designer (the user, 27 Nov: "a help and contact page that writes an email to me
// like in the portfolio"): the same three ways as the portfolio's Contact me, since a plain email link does nothing on a
// computer with no email app set up.
const TO = 'Kbmarchev@gmail.com'
const SUBJECT = 'blend: a question or feedback'
const BODY = 'Hi Chris,\n\n'
const q = encodeURIComponent
const WAYS = [
  { label: 'Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${q(TO)}&su=${q(SUBJECT)}&body=${q(BODY)}`, newTab: true },
  { label: 'Outlook', href: `https://outlook.office.com/mail/deeplink/compose?to=${q(TO)}&subject=${q(SUBJECT)}&body=${q(BODY)}`, newTab: true },
  { label: 'Email app', href: `mailto:${TO}?subject=${q(SUBJECT)}&body=${q(BODY)}`, newTab: false },
]

const FAQ = [
  {
    q: 'Is blend a real shop?',
    a: 'Not yet. blend is a design project: you can fill your change room and go through checkout, but nothing is charged or sent.',
  },
  {
    q: 'How does the change room work?',
    a: 'Add tops and bottoms from any event. In the change room, swipe each row to try every top with every bottom, then check out the ones you like.',
  },
  {
    q: 'Which size should I pick?',
    a: 'Set your sizes once in Account and every piece opens in them. The size guide in the menu has the measurements in EU, US, UK and Asian sizes.',
  },
  {
    q: 'What happens to my photo in Try-On?',
    a: 'It stays on your phone. Try-On is a preview for now, so the photo isn’t sent anywhere, and it’s gone when you close Try-On.',
  },
]

export function Help() {
  return (
    <MenuPage title="Help & contact" subtitle="Answers to the usual questions, and a way to ask your own.">
      <Group title="Questions">
        {FAQ.map((item) => (
          <li key={item.q}>
            <details className="faq">
              <summary className="menu-row faq__q">
                <span className="menu-row__text">
                  <span className="menu-row__label">{item.q}</span>
                </span>
                <span className="faq__mark" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          </li>
        ))}
      </Group>

      <Group title="Write to us" note="Questions, ideas or something broken? Write to Chris, who designed and built blend.">
        {WAYS.map((w) => (
          <OutRow key={w.label} href={w.href} newTab={w.newTab} label={w.label} spoken={`Write an email with ${w.label}`} />
        ))}
      </Group>
    </MenuPage>
  )
}
