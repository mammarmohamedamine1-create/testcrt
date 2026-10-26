"use strict";

const crest = "pictures/logos/normalized/";
const players = [
    { id: "377252", number: 16, name: "Abdelkader Morcely", position: "Goalkeeper", minutes: 270, goals: 0, appearances: 7 },
    { id: "42333", number: 30, name: "Mohamed Amine Saou", position: "Goalkeeper", minutes: 180, goals: 0, appearances: 3 },
    { id: "41105", number: 1, name: "Faris Boukerrit", position: "Goalkeeper", minutes: 180, goals: 0, appearances: 4 },
    { id: "41163", number: 21, name: "Abdellah Meddah", position: "Defender", minutes: 327, goals: 0, appearances: 7 },
    { id: "40962", number: 2, name: "Mohammed El Amine Ali Larbi", position: "Defender", minutes: 630, goals: 0, appearances: 7 },
    { id: "41742", number: 25, name: "Hammad Boutamina", position: "Defender", minutes: 274, goals: 0, appearances: 7 },
    { id: "40362", number: 8, name: "Abderrahmane Berkoun", position: "Defender", minutes: 192, goals: 0, appearances: 5 },
    { id: "53207", number: 5, name: "Safi Eddine Atmania", position: "Defender", minutes: 0, goals: 0, appearances: 0 },
    { id: "378101", number: 4, name: "Islam Chahrour", position: "Defender", minutes: 630, goals: 1, appearances: 7 },
    { id: "41033", number: 19, name: "Abdelillah Barkat", position: "Defender", minutes: 181, goals: 0, appearances: 4 },
    { id: "41829", number: 28, name: "Lahcene Bouziane", position: "Defender", minutes: 360, goals: 0, appearances: 4 },
    { id: "40874", number: 23, name: "Abdelhak Belkacemi", position: "Defender", minutes: 44, goals: 0, appearances: 5 },
    { id: "42759", number: 14, name: "Boubakar Baouche", position: "Defender", minutes: 602, goals: 1, appearances: 7 },
    { id: "53994", number: 3, name: "Wael Guerroudja", position: "Defender", minutes: 23, goals: 0, appearances: 3 },
    { id: "40971", number: 15, name: "Khathir Baaziz", position: "Midfielder", minutes: 388, goals: 0, appearances: 7 },
    { id: "274351", number: 17, name: "El Kacem Khodja", position: "Midfielder", minutes: 0, goals: 0, appearances: 3 },
    { id: "109849", number: 18, name: "Mohamed El Amine Zane", position: "Midfielder", minutes: 0, goals: 0, appearances: 0 },
    { id: "41098", number: 10, name: "Boumediene Freifer", position: "Midfielder", minutes: 286, goals: 1, appearances: 4 },
    { id: "41096", number: 12, name: "Redouane Bounoua", position: "Midfielder", minutes: 159, goals: 0, appearances: 5 },
    { id: "377241", number: 26, name: "Imed Saihi", position: "Midfielder", minutes: 498, goals: 0, appearances: 7 },
    { id: "616201", number: 24, name: "Seif Elden Essam Essayed", position: "Midfielder", nationality: "Egypt", minutes: 135, goals: 0, appearances: 4 },
    { id: "377225", number: 6, name: "Mohamed Es Seddik Senhadji", position: "Midfielder", minutes: 419, goals: 0, appearances: 5 },
    { id: "51972", number: 22, name: "Sid Ahmed Aissaoui", position: "Midfielder", minutes: 88, goals: 0, appearances: 4 },
    { id: "40930", number: 7, name: "Billel Bensaha", position: "Attacker", minutes: 118, goals: 0, appearances: 2 },
    { id: "616052", number: 9, name: "Mohamed Zaalouk", position: "Attacker", nationality: "Egypt", minutes: 315, goals: 1, appearances: 6 },
    { id: "41050", number: 20, name: "Mohamed Itim", position: "Attacker", minutes: 197, goals: 0, appearances: 7 },
    { id: "148660", number: 29, name: "Abdelkrim Souhaib Hamri", position: "Attacker", minutes: 53, goals: 0, appearances: 2 },
    { id: "40956", number: 27, name: "Mohamed Toumi Sief", position: "Attacker", minutes: 106, goals: 0, appearances: 5 },
    { id: "213221", number: 11, name: "Mehdi Hedroug", position: "Attacker", minutes: 197, goals: 1, appearances: 5 },
    { id: "44586", number: 13, name: "Naoufel Mardja", position: "Attacker", minutes: 78, goals: 0, appearances: 4 }
];

const matches = {
    "222361": {
        id: "222361", matchday: 7, date: "24 October 2026", isoDate: "2026-10-24", time: "19:00", stadium: "08 Mai 1945",
        home: { name: "ES Sétif", logo: "es-setif.png", score: 1 },
        away: { name: "CR Témouchent", logo: "cr-temouchent.png", score: 2 },
        events: [
            { minute: "15'", name: "Mohamed Zaalouk", team: "CR Témouchent" },
            { minute: "83'", name: "Boubakar Baouche", team: "CR Témouchent" },
            { minute: "90'+2", name: "Riad Benayad", team: "ES Sétif" }
        ]
    },
    "222359": {
        id: "222359", matchday: 6, date: "18 October 2026", isoDate: "2026-10-18", time: "17:45", stadium: "Omar Oucief Stadium",
        home: { name: "CR Témouchent", logo: "cr-temouchent.png", score: 1 },
        away: { name: "ASO Chlef", logo: "aso-chlef.png", score: 1 },
        events: [
            { minute: "53'", name: "Mehdi Hedroug", team: "CR Témouchent" },
            { minute: "68'", name: "Ousmane Diakite", team: "ASO Chlef" }
        ]
    },
    "222344": {
        id: "222344", matchday: 5, date: "14 October 2026", isoDate: "2026-10-14", time: "18:00", stadium: "Omar Oucief Stadium",
        home: { name: "CR Témouchent", logo: "cr-temouchent.png", score: 0 },
        away: { name: "MB Rouissat", logo: "mb-rouissat.png", score: 2 },
        events: [
            { minute: "30'", name: "Fatawu Hamidu Abdul", team: "MB Rouissat" },
            { minute: "75'", name: "Amokrane Abdelhakim", team: "MB Rouissat" }
        ]
    }
};

const upcomingFixture = {
    matchday: 8,
    date: "Monday 2 November 2026",
    time: "17:45",
    stadium: "Omar Oucief Stadium · Aïn Témouchent",
    home: { name: "CR Témouchent", logo: "cr-temouchent.png" },
    away: { name: "US Biskra", logo: "us-biskra.png" }
};

function badge(name, logo, className = "") {
    return `<img class="${className}" src="${crest}${logo}" alt="${name} crest">`;
}

function renderMissing(container, type) {
    container.innerHTML = `<p class="page-kicker">CR TÉMOUCHENT</p><section class="detail-empty"><h1>${type} unavailable</h1><p>That record is not in the current local season data.</p><a class="button button-primary" href="index.html">BACK TO HOME ↗</a></section>`;
}

function renderPlayer() {
    const container = document.getElementById("playerProfile");
    if (!container) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const player = players.find((entry) => entry.id === id);
    if (!player) return renderMissing(container, "Player profile");

    document.title = `${player.name} | CR Témouchent`;
    const goalsLabel = player.goals === 1 ? "GOAL" : "GOALS";
    container.innerHTML = `
        <p class="page-kicker"><a href="index.html#players">TEAM</a> / PLAYER ${String(player.number).padStart(2, "0")}</p>
        <section class="player-profile-hero">
            <div class="player-profile-number">${String(player.number).padStart(2, "0")}</div>
            <div class="player-profile-emblem">${badge("CR Témouchent", "cr-temouchent.png", "player-profile-crest")}</div>
            <div class="player-profile-title"><span>${player.position}${player.nationality ? ` · ${player.nationality}` : ""}</span><h1>${player.name}</h1><p>CR Témouchent · First Team</p></div>
        </section>
        <section class="player-stat-grid" aria-label="2026/27 season statistics">
            <div><strong id="playerAppearances">${player.appearances}</strong><span>APPEARANCES</span></div>
            <div><strong id="playerGoals">${player.goals}</strong><span>${goalsLabel}</span></div>
            <div><strong id="playerMinutes">${player.minutes}</strong><span>MINUTES</span></div>
        </section>
        <p class="data-note" id="playerLiveStatus">Ligue 1 Mobilis · 2026/27 season stats through 24 October 2026.</p>
        <div class="detail-actions"><a class="button button-outline" href="index.html#players">BACK TO TEAM</a><a class="button button-primary" href="fixtures.html">FIXTURES & RESULTS ↗</a></div>`;
}

function renderMatch() {
    const container = document.getElementById("matchReport");
    if (!container) return;
    const id = new URLSearchParams(window.location.search).get("id");
    if (id === "upcoming") {
        document.title = "CR Témouchent vs US Biskra | CR Témouchent";
        container.innerHTML = `
            <p class="page-kicker"><a href="fixtures.html">FIXTURES & RESULTS</a> / MATCHDAY 8</p>
            <h1 class="detail-page-title">Upcoming match</h1>
            <section class="match-report-card upcoming-report-card" data-live-upcoming-match>
                <div class="match-report-meta"><span id="detailUpcomingRound">UPCOMING · LIGUE 1 MOBILIS</span><time id="detailUpcomingDate" datetime="2026-11-02">Monday 2 November 2026 · 17:45</time></div>
                <div class="match-report-scoreline upcoming-report-scoreline">
                    <div>${badge(upcomingFixture.home.name, upcomingFixture.home.logo, "match-report-crest")}<strong data-team-name>${upcomingFixture.home.name}</strong><small>HOME</small></div>
                    <strong class="match-report-score">VS</strong>
                    <div>${badge(upcomingFixture.away.name, upcomingFixture.away.logo, "match-report-crest")}<strong data-team-name>${upcomingFixture.away.name}</strong><small>AWAY</small></div>
                </div>
                <p class="match-report-venue" id="detailUpcomingVenue">${upcomingFixture.stadium}</p>
            </section>
            <p class="data-note">Fixture data: Ligue de Football Professionnel · checked 26 October 2026.</p>
            <div class="detail-actions"><a class="button button-outline" href="fixtures.html#matchday-8">ALL MATCHDAY 8 FIXTURES</a><a class="button button-primary" href="index.html#matches">MATCH CENTRE ↗</a></div>`;
        return;
    }
    const match = matches[id];
    if (!match) {
        document.title = "Match Report | CR Témouchent";
        container.innerHTML = `
            <p class="page-kicker"><a href="fixtures.html">FIXTURES & RESULTS</a> / LIGUE 1</p>
            <h1 class="detail-page-title">Match report</h1>
            <section class="match-report-card">
                <div class="match-report-meta"><span>LIGUE 1 MOBILIS</span><time></time></div>
                <div class="match-report-scoreline">
                    <div><img class="match-report-crest" src="${crest}cr-temouchent.png" alt=""><strong></strong><small>HOME</small></div>
                    <strong class="match-report-score"></strong>
                    <div><img class="match-report-crest" src="${crest}cr-temouchent.png" alt=""><strong></strong><small>AWAY</small></div>
                </div>
                <p class="match-report-venue"></p>
            </section>
            <section class="match-events"><div class="detail-section-heading"><span class="section-label">MATCH EVENTS</span><h2>Goals</h2></div><ol></ol></section>
            <p class="data-note">Loading latest match report from LFP…</p>
            <div class="detail-actions"><a class="button button-outline" href="fixtures.html#results">ALL RESULTS</a><a class="button button-primary" href="index.html#matches">MATCH CENTRE ↗</a></div>`;
        return;
    }

    document.title = `${match.home.name} ${match.home.score}–${match.away.score} ${match.away.name} | CR Témouchent`;
    const events = match.events.map((event) => `<li class="match-event ${event.team === "CR Témouchent" ? "crt-event" : "opponent-event"}"><time>${event.minute}</time><span>${event.name}</span><small>${event.team}</small></li>`).join("");
    container.innerHTML = `
        <p class="page-kicker"><a href="fixtures.html">FIXTURES & RESULTS</a> / MATCHDAY ${match.matchday}</p>
        <h1 class="detail-page-title">Match report</h1>
        <section class="match-report-card">
            <div class="match-report-meta"><span>LIGUE 1 MOBILIS · MATCHDAY ${match.matchday}</span><time datetime="${match.isoDate}">${match.date} · ${match.time}</time></div>
            <div class="match-report-scoreline">
                <div>${badge(match.home.name, match.home.logo, "match-report-crest")}<strong>${match.home.name}</strong><small>HOME</small></div>
                <strong class="match-report-score">${match.home.score}<i>–</i>${match.away.score}</strong>
                <div>${badge(match.away.name, match.away.logo, "match-report-crest")}<strong>${match.away.name}</strong><small>AWAY</small></div>
            </div>
            <p class="match-report-venue">${match.stadium}</p>
        </section>
        <section class="match-events"><div class="detail-section-heading"><span class="section-label">MATCH EVENTS</span><h2>Goals</h2></div><ol>${events}</ol></section>
        <p class="data-note">Match report data: Ligue de Football Professionnel · 2026/27.</p>
        <div class="detail-actions"><a class="button button-outline" href="fixtures.html#results">ALL RESULTS</a><a class="button button-primary" href="index.html#matches">MATCH CENTRE ↗</a></div>`;
}

function renderFixtures() {
    const container = document.getElementById("fixtureList");
    if (!container) return;
    const upcomingRow = `<article class="fixture-page-row fixture-page-crt">
        <div class="fixture-page-time"><span>${upcomingFixture.date}</span><strong>${upcomingFixture.time}</strong></div>
        <div class="fixture-page-team">${badge(upcomingFixture.home.name, upcomingFixture.home.logo, "fixture-page-crest")}<strong>${upcomingFixture.home.name}</strong></div>
        <span class="fixture-page-vs">VS</span>
        <div class="fixture-page-team">${badge(upcomingFixture.away.name, upcomingFixture.away.logo, "fixture-page-crest")}<strong>${upcomingFixture.away.name}</strong></div>
        <small class="fixture-page-venue">${upcomingFixture.stadium}</small>
        <a class="fixture-page-link" href="match.html?id=upcoming">MATCH DETAILS ↗</a>
    </article>`;
    const recentRows = Object.values(matches).map((match) => `<a href="match.html?id=${match.id}">
        <time>${match.date.slice(0, 6).toUpperCase()}</time>
        <strong>${match.home.name} ${match.home.score}–${match.away.score} ${match.away.name}</strong>
        <span>${match.home.name === "CR Témouchent" ? (match.home.score > match.away.score ? "W" : match.home.score === match.away.score ? "D" : "L") : (match.away.score > match.home.score ? "W" : match.away.score === match.home.score ? "D" : "L")}</span>
    </a>`).join("");
    container.innerHTML = `<section class="fixture-matchday" id="upcoming"><div class="detail-section-heading"><span class="section-label">CR TÉMOUCHENT · NEXT</span><h2>Upcoming fixture</h2></div>${upcomingRow}</section>
        <section class="fixture-recent" id="results"><div class="detail-section-heading"><span class="section-label">CR TÉMOUCHENT · LIGUE 1</span><h2>Recent results</h2></div>${recentRows}</section>`;
}

renderPlayer();
renderMatch();
renderFixtures();
