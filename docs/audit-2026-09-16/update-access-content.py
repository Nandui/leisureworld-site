from pathlib import Path

root = Path(__file__).resolve().parents[2]
path = root / 'accessibility.html'
html = path.read_text(encoding='utf-8')
start = html.index('<main id="main"')
end = html.index('</main>', start) + len('</main>')
main = '''<main id="main" tabindex="-1">
<section aria-labelledby="page-title" class="page-lead content-width" id="home">
<nav aria-label="Breadcrumb" class="breadcrumbs"><ol><li><a href="index.html">Home</a></li><li aria-current="page">Access &amp; Functional Zone</li></ol></nav>
<p class="eyebrow">Access &amp; inclusion</p><h1 id="page-title">A welcome<br/>that works for you.</h1>
<p class="body-copy">Find out about access facilities and support, then speak to your centre about what would help you enjoy your visit.</p>
<div class="action-group"><a class="button button-solid" href="#access-support">Contact your centre <i aria-hidden="true" class="ti ti-arrow-right"></i></a><a class="text-link" href="#functional-zone">About the Functional Zone <i aria-hidden="true" class="ti ti-arrow-right"></i></a></div>
</section>
<section aria-labelledby="access-facilities-title" class="content-section white-section"><div class="content-width section-space">
<div class="section-heading"><div><h2 id="access-facilities-title">Facilities that help.</h2></div></div>
<div class="prose"><p>LeisureWorld’s access facilities include the features below. Facilities and arrangements differ by centre, so please check the support you need with your chosen reception before travelling.</p></div>
<div class="info-grid">
<article class="info-card"><i aria-hidden="true" class="ti ti-map-pin"></i><h3>Arriving &amp; changing.</h3><p>Accessible parking is provided near the entrance. Accessible toilets, showers and changing facilities are available, with individual and group spaces in the changing village.</p></article>
<article class="info-card"><i aria-hidden="true" class="ti ti-swimming"></i><h3>Getting into the pool.</h3><p>Pool access includes shallow-end steps and a hoist for main and learner pools on request. Trained staff, including lifeguards, can assist with entering and leaving the water. Arrange any hoist support with reception.</p></article>
<article class="info-card"><i aria-hidden="true" class="ti ti-barbell"></i><h3>Using the gym.</h3><p>Lift access serves gym and studio areas. Adaptable equipment includes cable machines, free weights and an arm-cycle machine with a removable seat for wheelchair access.</p></article>
</div>
<div class="prose section-space" id="access-support"><h3>Talk to your centre.</h3><p>Tell reception which activity you are coming for and any equipment or assistance you need. They can explain the route through the building and confirm arrangements for your session.</p><ul><li><a href="tel:+353214346505">Bishopstown: 021 434 6505</a></li><li><a href="tel:+353214397868">Churchfield: 021 439 7868</a></li><li><a href="tel:+353214293073">Gus Healy Pool, Douglas: 021 429 3073</a></li></ul><p>Prefer email? <a href="contact.html?topic=Accessibility#message">Email our team about access</a>.</p></div>
</div></section>
<section aria-labelledby="functional-zone-title" class="content-section functional-zone-section" id="functional-zone"><div class="content-width section-space">
<div class="section-heading"><div><h2 id="functional-zone-title">The Functional Zone.</h2></div></div>
<dl class="quick-facts"><div><dt>Location</dt><dd>LeisureWorld Bishopstown</dd></div><div><dt>Referral route</dt><dd>HSE Community Physiotherapy only</dd></div></dl>
<div class="prose"><h3>Adapted space for exercise.</h3><p>The Functional Zone is a gym area at Bishopstown with adapted equipment for people whose movement is affected by a neurological condition.</p><h3>How to get started.</h3><p>Access to Functional Zone sessions is through the HSE Community Physiotherapy service only. Speak to your community physiotherapist about referral. LeisureWorld does not decide who is referred.</p><p>For questions about the space or equipment, <a href="contact.html?topic=Accessibility&amp;centre=Bishopstown#message">contact Bishopstown reception</a>.</p></div>
</div></section>
<section class="next-step content-width"><div><h2>Every Body Belongs.</h2><p>Read our <a href="Policies/disability-inclusion-policy.html">disability inclusion policy</a> and how to get help <a href="website-accessibility.html">using this website</a>.</p></div></section>
</main>'''
path.write_text(html[:start] + main + html[end:], encoding='utf-8')
