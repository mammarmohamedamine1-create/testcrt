"use strict";

(() => {
    const lfpBase = "https://www.lfp.dz/en";
    const fallbackSelection = { divisionId: 4251, seasonId: 6, seasonLabel: "2026/2027" };
    let activeSelection = null;
    let activeSelectionTime = 0;
    let selectionRequest = null;
    const crTemouchentId = 754;
    const logoFolder = "pictures/logos/normalized/";
    const logoFiles = {
        524: "aso-chlef.png",
        670: "cr-belouizdad.png",
        754: "cr-temouchent.png",
        678: "cs-constantine.png",
        755: "es-ben-aknoun.png",
        676: "es-setif.png",
        759: "js-el-biar.png",
        674: "js-kabylie.png",
        672: "js-saoura.png",
        409: "mb-rouissat.png",
        677: "mc-alger.png",
        675: "mc-oran.png",
        758: "olympique-akbou.png",
        518: "us-biskra.png",
        673: "usm-alger.png",
        653: "usm-khenchela.png"
    };

    function shortSeason(label) {
        const match = String(label || "").match(/(\d{4})\/(\d{4})/);
        return match ? `${match[1]}/${match[2].slice(-2)}` : "2026/27";
    }

    function updateSeasonLabels(label) {
        const shortLabel = shortSeason(label);
        const homepage = document.getElementById("liveSeasonLabel");
        if (homepage) homepage.textContent = `LIGUE 1 MOBILIS · ${shortLabel}`;
        const fixtures = document.getElementById("fixtureSeasonLabel");
        if (fixtures) fixtures.textContent = `LIGUE 1 MOBILIS · ${shortLabel}`;
        const player = document.getElementById("playerSeasonLabel");
        if (player) player.textContent = shortLabel;
    }

    async function getCompetitionSelection() {
        if (activeSelection && Date.now() - activeSelectionTime < 30 * 60 * 1000) return activeSelection;
        if (selectionRequest) return selectionRequest;

        selectionRequest = (async () => {
            try {
                const response = await fetch(`${lfpBase}/ranking`, { cache: "no-store" });
                if (!response.ok) throw new Error(`LFP ranking page failed: ${response.status}`);
                const page = new DOMParser().parseFromString(await response.text(), "text/html");
                const seasonSelector = page.querySelector("#ranking-season-selector .dropdown-item.active");
                const divisionSelector = page.querySelector("#ranking-division-selector .dropdown-item.active");
                const seasonId = Number(seasonSelector?.getAttribute("data-value"));
                const divisionId = Number(divisionSelector?.getAttribute("data-value"));
                const seasonLabel = seasonSelector?.textContent.trim();
                if (!seasonId || !divisionId || !seasonLabel) throw new Error("LFP active season selector was not found");

                activeSelection = { seasonId, divisionId, seasonLabel };
                activeSelectionTime = Date.now();
                updateSeasonLabels(seasonLabel);
                return activeSelection;
            } catch (error) {
                console.warn("Unable to read LFP's active season; using the saved season selection.", error);
                activeSelection = fallbackSelection;
                activeSelectionTime = Date.now();
                updateSeasonLabels(activeSelection.seasonLabel);
                return activeSelection;
            }
        })();

        try {
            return await selectionRequest;
        } finally {
            selectionRequest = null;
        }
    }

    async function fetchJson(path) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch(`${lfpBase}/${path}`, {
                cache: "no-store",
                headers: { Accept: "application/json" },
                signal: controller.signal
            });

            if (!response.ok) throw new Error(`LFP request failed: ${response.status}`);
            return await response.json();
        } finally {
            clearTimeout(timeout);
        }
    }

    function formatTime() {
        return new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date());
    }

    function dateDetails(value) {
        const match = String(value || "").match(/^(?:(\w+)\s+)?(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
        if (!match) return { day: "--", month: "---", iso: "", weekday: "" };

        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
        const monthIndex = monthNames.indexOf(match[3].toLowerCase());
        const monthNumber = String(monthIndex + 1).padStart(2, "0");

        return {
            day: match[2].padStart(2, "0"),
            month: match[3].slice(0, 3).toUpperCase(),
            iso: monthIndex < 0 ? "" : `${match[4]}-${monthNumber}-${match[2].padStart(2, "0")}`,
            weekday: match[1] || ""
        };
    }

    function matchdayNumber(match) {
        const number = String(match?.round || "").match(/\d+/);
        return number ? Number(number[0]) : 0;
    }

    function clubLogo(club) {
        const file = logoFiles[club?.id] || "cr-temouchent.png";
        return `${logoFolder}${file}`;
    }

    function makeLogo(club, className = "") {
        const image = document.createElement("img");
        image.src = clubLogo(club);
        image.alt = "";
        if (className) image.className = className;
        return image;
    }

    function setStatus(message, isError = false) {
        const status = document.getElementById("liveDataStatus");
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("is-error", isError);
        status.classList.toggle("is-live", !isError);
    }

    function renderStandings(ranking) {
        const body = document.getElementById("standingsBody");
        if (!body || !Array.isArray(ranking) || ranking.length === 0) return;

        const rows = ranking.map((club, index) => {
            const position = index + 1;
            const row = document.createElement("tr");
            if (position <= 2) row.classList.add("zone-champions");
            if (position === 3) row.classList.add("zone-confederation");
            if (position >= ranking.length - 2) row.classList.add("zone-relegation");
            if (club.id === crTemouchentId) row.classList.add("standings-highlight");

            const values = [position];
            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });

            const clubCell = document.createElement("td");
            const clubWrap = document.createElement("span");
            clubWrap.className = "club-cell";
            clubWrap.append(makeLogo(club));
            const clubName = document.createElement("span");
            clubName.textContent = club.name;
            clubWrap.append(clubName);
            clubCell.append(clubWrap);
            row.append(clubCell);

            [club.matches_played, club.wins, club.nul, club.defeat, club.goals_plus, club.goals_minus, club.diff, club.points]
                .forEach((value) => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.append(cell);
                });

            return row;
        });

        body.replaceChildren(...rows);

        const crt = ranking.find((club) => club.id === crTemouchentId);
        const matchday = matchdayNumber(crt?.prevMatch) || Math.max(1, matchdayNumber(crt?.nextMatch) - 1);
        const title = document.getElementById("standingsTitle");
        if (title) title.innerHTML = `Ligue 1 standings <span class="accent">·</span> Matchday ${matchday}`;

        const updated = document.getElementById("standingsUpdated");
        if (updated) updated.textContent = `Live from LFP · Updated ${formatTime()}`;
    }

    function makeTeam(name, club, side) {
        const team = document.createElement("div");
        team.className = "upcoming-team";
        team.append(makeLogo(club));

        const label = document.createElement("strong");
        label.textContent = name;
        const location = document.createElement("small");
        location.textContent = side;
        team.append(label, location);
        return team;
    }

    function renderUpcoming(nextMatch) {
        const card = document.getElementById("upcomingMatchCard");
        if (!card || !nextMatch?.homeClub || !nextMatch?.awayClub) return;

        const date = dateDetails(nextMatch.date);
        const matchday = matchdayNumber(nextMatch);
        const top = document.createElement("div");
        top.className = "upcoming-match-top";
        const competition = document.createElement("span");
        competition.className = "competition";
        competition.textContent = "NEXT MATCH · LIGUE 1";
        const status = document.createElement("span");
        status.className = "match-status";
        status.textContent = `MATCHDAY ${matchday}`;
        top.append(competition, status);

        const dateBlock = document.createElement("div");
        dateBlock.className = "upcoming-match-date";
        const day = document.createElement("strong");
        day.textContent = date.day;
        const month = document.createElement("span");
        month.textContent = `${date.month} ${date.iso.slice(0, 4)}`;
        const kickoff = document.createElement("small");
        kickoff.textContent = `${date.weekday.toUpperCase()} · ${nextMatch.time}`;
        dateBlock.append(day, month, kickoff);

        const teams = document.createElement("div");
        teams.className = "upcoming-match-teams";
        teams.append(makeTeam(nextMatch.homeClub.name, nextMatch.homeClub, "HOME"));
        const versus = document.createElement("span");
        versus.className = "fixture-vs";
        versus.textContent = "VS";
        teams.append(versus, makeTeam(nextMatch.awayClub.name, nextMatch.awayClub, "AWAY"));

        const footer = document.createElement("div");
        footer.className = "upcoming-match-bottom";
        const venue = document.createElement("span");
        venue.textContent = nextMatch.stade;
        const details = document.createElement("a");
        details.href = "match.html?id=upcoming";
        details.textContent = "FIXTURE DETAILS ↗";
        footer.append(venue, details);

        card.replaceChildren(top, dateBlock, teams, footer);
    }

    function updateUpcomingMatchDetail(nextMatch) {
        const card = document.querySelector(".upcoming-report-card");
        if (!card || !nextMatch?.homeClub || !nextMatch?.awayClub) return;

        const date = dateDetails(nextMatch.date);
        const dayLabel = `${date.weekday} ${date.day} ${date.month} ${date.iso.slice(0, 4)} · ${nextMatch.time}`;
        const dateElement = document.getElementById("detailUpcomingDate");
        if (dateElement) {
            dateElement.dateTime = date.iso;
            dateElement.textContent = dayLabel;
        }

        const round = matchdayNumber(nextMatch);
        const roundElement = document.getElementById("detailUpcomingRound");
        if (roundElement) roundElement.textContent = `UPCOMING · LIGUE 1 MOBILIS · MATCHDAY ${round}`;

        const teamElements = card.querySelectorAll("[data-team-name]");
        const clubs = [nextMatch.homeClub, nextMatch.awayClub];
        teamElements.forEach((teamElement, index) => {
            const club = clubs[index];
            if (!club) return;
            teamElement.textContent = club.name;
            const image = teamElement.parentElement.querySelector("img");
            if (image) {
                image.src = clubLogo(club);
                image.alt = `${club.name} crest`;
            }
        });

        const venue = document.getElementById("detailUpcomingVenue");
        if (venue) venue.textContent = nextMatch.stade;
    }

    async function refreshMatchReport() {
        const container = document.getElementById("matchReport");
        if (!container) return;
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) return;
        if (id === "upcoming") {
            try {
                const selection = await getCompetitionSelection();
                const ranking = await fetchJson(`ranking-data?division=${selection.divisionId}&season=${selection.seasonId}`);
                const crt = ranking.find((club) => club.id === crTemouchentId);
                if (!crt?.nextMatch) throw new Error("Upcoming CR Témouchent fixture not found");
                updateUpcomingMatchDetail(crt.nextMatch);
                const note = container.querySelector(".data-note");
                if (note) note.textContent = `Live LFP fixture · Updated ${formatTime()}`;
            } catch (error) {
                console.warn("Live LFP upcoming fixture unavailable; keeping saved data.", error);
                const note = container.querySelector(".data-note");
                if (note) note.textContent = "LFP feed unavailable · showing saved fixture.";
            }
            return;
        }

        try {
            const response = await fetch(`https://www.lfp.dz/en/match/${encodeURIComponent(id)}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`LFP match request failed: ${response.status}`);
            const documentData = new DOMParser().parseFromString(await response.text(), "text/html");
            const hero = documentData.querySelector(".match-hero");
            const teamLinks = [...(hero?.querySelectorAll(".match-hero-teams > a") || [])];
            const scores = [...(hero?.querySelectorAll(".teams-scores .team-score") || [])];
            if (teamLinks.length !== 2 || scores.length !== 2) throw new Error("LFP match data is incomplete");

            const readClub = (link) => {
                const name = link.querySelector(".team-name")?.textContent.trim();
                const idMatch = link.getAttribute("href")?.match(/\/club\/(\d+)/);
                return name && idMatch ? { id: Number(idMatch[1]), name } : null;
            };
            const home = readClub(teamLinks[0]);
            const away = readClub(teamLinks[1]);
            if (!home || !away) throw new Error("LFP match teams were not found");

            const dateText = documentData.querySelector(".match-date span")?.textContent.trim() || "";
            const time = documentData.querySelector(".match-time span")?.textContent.trim() || "";
            const venueText = documentData.querySelector(".match-location span")?.textContent.trim() || "";
            const matchdayText = documentData.querySelector(".match-round-competition span:last-child")?.textContent.trim() || "";
            const matchday = matchdayNumber({ round: matchdayText });
            const scoreline = container.querySelector(".match-report-scoreline");
            const teamCards = scoreline?.querySelectorAll(":scope > div") || [];
            if (teamCards.length !== 2) throw new Error("Local match report structure is missing");

            [home, away].forEach((club, index) => {
                const card = teamCards[index];
                const image = card.querySelector("img");
                const name = card.querySelector("strong");
                if (image) {
                    image.src = clubLogo(club);
                    image.alt = `${club.name} crest`;
                }
                if (name) name.textContent = club.name;
            });

            const score = scoreline.querySelector(".match-report-score");
            if (score) score.textContent = `${scores[0].textContent.trim()}–${scores[1].textContent.trim()}`;
            const reportMeta = container.querySelector(".match-report-meta");
            if (reportMeta) {
                reportMeta.querySelector("span").textContent = `LIGUE 1 MOBILIS · MATCHDAY ${matchday}`;
                const timeElement = reportMeta.querySelector("time");
                if (timeElement) {
                    timeElement.dateTime = dateDetails(dateText).iso;
                    timeElement.textContent = `${dateText} · ${time}`;
                }
            }
            const venue = container.querySelector(".match-report-venue");
            if (venue) venue.textContent = venueText;
            document.title = `${home.name} ${scores[0].textContent.trim()}–${scores[1].textContent.trim()} ${away.name} | CR Témouchent`;

            const eventList = container.querySelector(".match-events ol");
            const goalEvents = [...documentData.querySelectorAll(".events-list .goal-match-event")];
            if (eventList) {
                const items = goalEvents.map((goal) => {
                    const minute = goal.querySelector(".match-event-time")?.textContent.trim() || "";
                    const description = goal.querySelector(".match-event-desc")?.textContent.replace(/\s+/g, " ").trim() || "";
                    const teamCode = description.match(/\(([^)]+)\)\s*$/)?.[1] || "";
                    const scorer = description.replace(/^Goal by\s*/i, "").replace(/\s*\([^)]+\)\s*$/, "");
                    const crtIsHome = home.id === crTemouchentId;
                    const club = teamCode === "CRT" ? (crtIsHome ? home : away) : (crtIsHome ? away : home);
                    const item = document.createElement("li");
                    item.className = `match-event ${club.id === crTemouchentId ? "crt-event" : "opponent-event"}`;
                    const timeElement = document.createElement("time");
                    timeElement.textContent = `${minute}'`;
                    const nameElement = document.createElement("span");
                    nameElement.textContent = scorer;
                    const teamElement = document.createElement("small");
                    teamElement.textContent = club.name;
                    item.append(timeElement, nameElement, teamElement);
                    return item;
                });
                eventList.replaceChildren(...items);
            }

            const note = container.querySelector(".data-note");
            if (note) note.textContent = `Live LFP match report · Updated ${formatTime()}`;
        } catch (error) {
            console.warn("Live LFP match report unavailable; keeping saved data.", error);
        }
    }

    function resultDate(match) {
        const details = dateDetails(match.date);
        return { label: `${details.day} ${details.month}`, iso: details.iso };
    }

    function isCompleted(match) {
        return match.homeScore !== "-" && match.awayScore !== "-" && match.homeScore !== "" && match.awayScore !== "";
    }

    function involvingCrt(match) {
        return match.homeClub?.id === crTemouchentId || match.awayClub?.id === crTemouchentId;
    }

    function createResultRow(match) {
        const date = resultDate(match);
        const row = document.createElement("a");
        row.className = "result-row";
        row.href = `match.html?id=${match.id}`;

        const time = document.createElement("time");
        time.dateTime = date.iso;
        time.textContent = date.label;
        const home = document.createElement("span");
        home.className = "result-home";
        home.append(makeLogo(match.homeClub));
        const homeName = document.createElement("span");
        homeName.textContent = match.homeClub.name;
        home.append(homeName);
        const score = document.createElement("strong");
        score.className = "result-score";
        score.textContent = `${match.homeScore}–${match.awayScore}`;
        const away = document.createElement("span");
        away.className = "result-away";
        away.append(makeLogo(match.awayClub));
        const awayName = document.createElement("span");
        awayName.textContent = match.awayClub.name;
        away.append(awayName);
        row.append(time, home, score, away);
        return row;
    }

    function renderRecentResults(matches) {
        const section = document.getElementById("recentResults");
        if (!section || matches.length === 0) return;
        section.querySelectorAll(".result-row").forEach((row) => row.remove());
        matches.forEach((match) => section.append(createResultRow(match)));
    }

    function fixturePageRow(match) {
        const row = document.createElement("article");
        row.className = `fixture-page-row${involvingCrt(match) ? " fixture-page-crt" : ""}`;
        const date = document.createElement("div");
        date.className = "fixture-page-time";
        const dateText = document.createElement("span");
        const day = dateDetails(match.date);
        dateText.textContent = `${day.weekday} ${day.day} ${day.month}`;
        const time = document.createElement("strong");
        time.textContent = match.time;
        date.append(dateText, time);

        const home = document.createElement("div");
        home.className = "fixture-page-team";
        home.append(makeLogo(match.homeClub, "fixture-page-crest"));
        const homeName = document.createElement("strong");
        homeName.textContent = match.homeClub.name;
        home.append(homeName);

        const versus = document.createElement("span");
        versus.className = "fixture-page-vs";
        versus.textContent = isCompleted(match) ? `${match.homeScore}–${match.awayScore}` : "VS";

        const away = document.createElement("div");
        away.className = "fixture-page-team";
        away.append(makeLogo(match.awayClub, "fixture-page-crest"));
        const awayName = document.createElement("strong");
        awayName.textContent = match.awayClub.name;
        away.append(awayName);

        const venue = document.createElement("small");
        venue.className = "fixture-page-venue";
        venue.textContent = match.stade;
        row.append(date, home, versus, away, venue);

        if (involvingCrt(match)) {
            const link = document.createElement("a");
            link.className = "fixture-page-link";
            link.href = isCompleted(match) ? `match.html?id=${match.id}` : "match.html?id=upcoming";
            link.textContent = isCompleted(match) ? "MATCH REPORT ↗" : "CRT MATCH DETAILS ↗";
            row.append(link);
        }

        return row;
    }

    function renderFixturesPage(fixtures, recentMatches) {
        const container = document.getElementById("fixtureList");
        if (!container) return;
        container.replaceChildren();

        const makeHeading = (labelText, titleText) => {
            const heading = document.createElement("div");
            heading.className = "detail-section-heading";
            const label = document.createElement("span");
            label.className = "section-label";
            label.textContent = labelText;
            const title = document.createElement("h2");
            title.textContent = titleText;
            heading.append(label, title);
            return heading;
        };

        const upcomingFixtures = fixtures.filter((match) => involvingCrt(match) && !isCompleted(match));
        const fixtureSection = document.createElement("section");
        fixtureSection.className = "fixture-matchday";
        fixtureSection.id = "upcoming";
        fixtureSection.append(makeHeading("CR TÉMOUCHENT · NEXT", "Upcoming fixture"));
        if (upcomingFixtures.length > 0) {
            fixtureSection.append(...upcomingFixtures.map(fixturePageRow));
        } else {
            const emptyState = document.createElement("p");
            emptyState.className = "fixture-empty";
            emptyState.textContent = "No upcoming CR Témouchent fixture is currently listed.";
            fixtureSection.append(emptyState);
        }

        const resultsSection = document.createElement("section");
        resultsSection.className = "fixture-recent";
        resultsSection.id = "results";
        resultsSection.append(makeHeading("CR TÉMOUCHENT · LIGUE 1", "Recent results"));
        const crTemouchentResults = recentMatches.filter((match) => involvingCrt(match) && isCompleted(match)).slice(0, 3);
        crTemouchentResults.forEach((match) => {
            const link = document.createElement("a");
            link.href = `match.html?id=${match.id}`;
            const date = document.createElement("time");
            date.textContent = resultDate(match).label;
            const summary = document.createElement("strong");
            summary.textContent = `${match.homeClub.name} ${match.homeScore}–${match.awayScore} ${match.awayClub.name}`;
            const result = document.createElement("span");
            result.textContent = match.homeClub.id === crTemouchentId ? (Number(match.homeScore) > Number(match.awayScore) ? "W" : Number(match.homeScore) === Number(match.awayScore) ? "D" : "L") : (Number(match.awayScore) > Number(match.homeScore) ? "W" : Number(match.awayScore) === Number(match.homeScore) ? "D" : "L");
            link.append(date, summary, result);
            resultsSection.append(link);
        });
        container.append(fixtureSection, resultsSection);
    }

    async function fetchRecentMatches(currentRound, selection) {
        const rounds = [currentRound, currentRound - 1, currentRound - 2, currentRound - 3].filter((round) => round > 0);
        const responses = await Promise.allSettled(rounds.map((round) => fetchJson(`calendar-data?division=${selection.divisionId}&season=${selection.seasonId}&matchday=${round}`)));
        return responses.flatMap((result) => result.status === "fulfilled" && Array.isArray(result.value) ? result.value : [])
            .filter((match) => involvingCrt(match) && isCompleted(match))
            .sort((a, b) => resultDate(b).iso.localeCompare(resultDate(a).iso))
            .filter((match, index, all) => all.findIndex((candidate) => candidate.id === match.id) === index)
            .slice(0, 3);
    }

    async function refreshIndexAndFixtures() {
        const matchReport = document.getElementById("matchReport");
        if (matchReport) {
            await refreshMatchReport();
            return;
        }

        const needsRanking = document.getElementById("standingsBody") || document.getElementById("upcomingMatchCard") || document.getElementById("fixtureList");
        if (!needsRanking) return;
        try {
            const selection = await getCompetitionSelection();
            const ranking = await fetchJson(`ranking-data?division=${selection.divisionId}&season=${selection.seasonId}`);
            if (!Array.isArray(ranking) || ranking.length === 0) throw new Error("LFP standings are empty");
            renderStandings(ranking);

            const crt = ranking.find((club) => club.id === crTemouchentId);
            if (!crt) throw new Error("CR Témouchent was not found in LFP standings");
            renderUpcoming(crt.nextMatch);

            const previousRound = matchdayNumber(crt.prevMatch) || Math.max(1, matchdayNumber(crt.nextMatch) - 1);
            const nextRound = matchdayNumber(crt.nextMatch) || previousRound + 1;
            const [fixturesResponse, recentMatches] = await Promise.all([
                fetchJson(`calendar-data?division=${selection.divisionId}&season=${selection.seasonId}&matchday=${nextRound}`),
                fetchRecentMatches(previousRound, selection)
            ]);
            const fixtures = Array.isArray(fixturesResponse) ? fixturesResponse : [];
            renderRecentResults(recentMatches);
            renderFixturesPage(fixtures, recentMatches);

            const intro = document.getElementById("fixtureIntro");
            if (intro) intro.textContent = "CR Témouchent · Upcoming fixture and recent results";
            const fixtureUpdated = document.getElementById("fixtureUpdated");
            if (fixtureUpdated) fixtureUpdated.textContent = `LFP ${shortSeason(selection.seasonLabel)} · Updated ${formatTime()}`;
            setStatus(`Live LFP data · Updated ${formatTime()}`);
            updateUpcomingMatchDetail(crt.nextMatch);
        } catch (error) {
            console.warn("Live LFP update unavailable; keeping saved data.", error);
            setStatus("LFP feed unavailable · showing saved snapshot", true);
            const playerStatus = document.getElementById("playerLiveStatus");
            if (playerStatus) playerStatus.textContent = "LFP feed unavailable · showing saved season stats.";
        }
    }

    async function refreshPlayerStats() {
        const container = document.getElementById("playerProfile");
        if (!container) return;
        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) return;

        try {
            const selection = await getCompetitionSelection();
            const response = await fetch(`https://lfp.dz/en/player/${encodeURIComponent(id)}`, { cache: "no-store" });
            if (!response.ok) throw new Error(`LFP player request failed: ${response.status}`);
            const html = await response.text();
            const text = new DOMParser().parseFromString(html, "text/html").body.innerText.replace(/\s+/g, " ");
            const stats = text.match(/(\d+)\s+Minutes Played\s+(\d+)\s+Goals\s+(\d+)\s+Appearances/);
            if (!stats) throw new Error("LFP player stats were not found");
            document.querySelector("#playerMinutes").textContent = stats[1];
            document.querySelector("#playerGoals").textContent = stats[2];
            document.querySelector("#playerAppearances").textContent = stats[3];
            document.getElementById("playerLiveStatus").textContent = `Live LFP ${shortSeason(selection.seasonLabel)} stats · Updated ${formatTime()}`;
        } catch (error) {
            console.warn("Live LFP player stats unavailable; keeping saved data.", error);
            const status = document.getElementById("playerLiveStatus");
            if (status) status.textContent = "LFP feed unavailable · showing saved season stats.";
        }
    }

    async function refresh() {
        await Promise.allSettled([refreshIndexAndFixtures(), refreshPlayerStats()]);
    }

    refresh();
    window.setInterval(() => {
        if (document.visibilityState === "visible") refresh();
    }, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") refresh();
    });
})();
