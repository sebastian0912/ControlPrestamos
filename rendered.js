const $ = (selector) => document.querySelector(selector)

const $count = $('#count')
const $button = $('button')

// hacer click a button y cambiar el valor de count
$button.addEventListener('click', () => {
    const count = +$count.innerHTML
    $count.innerHTML = (count + 1).toString()
}
)
