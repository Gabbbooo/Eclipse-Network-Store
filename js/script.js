const config = {
    serverInfo: {
        serverLogoImageFileName: "logo.png",
        serverName: "Eclipse Network",
        serverIp: "eclipze.xyz",
        discordServerID: "1047115825460555796"
    },
    userSKinTypeInAdminTeam: "bust",
    atGroupsDefaultColors: {
        leaders: "rgba(255, 124, 124, 0.5)",
        managment: "rgba(255, 0, 0, 1)"'
        developers: "rgba(230, 83, 0, 0.5)",
        helpers: "rgba(11, 175, 255, 0.5)"
    },
    adminTeamPage: {
        leaders: [
            {
                inGameName: "GabbyDoesnt",
                rank: "Founder",
                skinUrlOrPathToFile: "",
                rankColor: "rgba(255, 3, 3, 1)"
            }
            
        ],
        managment: [

            {
                inGameName: "xstym",
                rank: "Owner",
                skinUrlOrPathToFile: "",
                rankColor: "" 
            },
        
        ],
        developers: [
            {
                inGameName: "Theymon",
                rank: "Developer",
                skinUrlOrPathToFile: "",
                rankColor: ""
            },
            {
                inGameName: "DarkMyst",
                rank: "Developer",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ],
        helpers: [
            {
                inGameName: "Lurzy",
                rank: "Helper",
                skinUrlOrPathToFile: "",
                rankColor: ""
            }
        ]
    },
    contactPage: {
        email: "eclipsenetworkoriginal@gmail.com"
    }
};

// Mobile navbar (open, close)
const navbar = document.querySelector(".navbar");
const navbarLinks = document.querySelector(".links");
const hamburger = document.querySelector(".hamburger");

hamburger.addEventListener("click", () => {
    navbar.classList.toggle("active");
    navbarLinks.classList.toggle("active");
});

// FAQs
const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
    accordionItemHeader.addEventListener("click", () => {
        accordionItemHeader.classList.toggle("active");
        const accordionItemBody = accordionItemHeader.nextElementSibling;
        accordionItemBody.style.maxHeight = accordionItemHeader.classList.contains("active") ? accordionItemBody.scrollHeight + "px" : "0px";
    });
});

// Config navbar
const serverName = document.querySelector(".server-name");
const serverLogo = document.querySelector(".logo-img");

// Config header
const serverIp = document.querySelector(".minecraft-server-ip");
const serverLogoHeader = document.querySelector(".logo-img-header");
const discordOnlineUsers = document.querySelector(".discord-online-users");
const minecraftOnlinePlayers = document.querySelector(".minecraft-online-players");

// Config contact
const contactForm = document.querySelector(".contact-form");
const inputWithLocationAfterSubmit = document.querySelector(".location-after-submit");

const getDiscordOnlineUsers = async () => {
    try {
        const apiWidgetUrl = `https://discord.com/api/guilds/${config.serverInfo.discordServerID}/widget.json`;
        let response = await fetch(apiWidgetUrl);
        let data = await response.json();
        return data.presence_count || "None";
    } catch (e) {
        console.error("Error fetching Discord online users:", e);
        return "None";
    }
};

const getMinecraftOnlinePlayer = async () => {
    try {
        const apiUrl = `https://api.mcsrvstat.us/2/${config.serverInfo.serverIp}`;
        let response = await fetch(apiUrl);
        let data = await response.json();
        return data.players.online;
    } catch (e) {
        console.error("Error fetching Minecraft online players:", e);
        return "None";
    }
};

const getUuidByUsername = async (username) => {
    try {
        const usernameToUuidApi = `https://api.minetools.eu/uuid/${username}`;
        let response = await fetch(usernameToUuidApi);
        let data = await response.json();
        return data.id;
    } catch (e) {
        console.error("Error fetching UUID by username:", e);
        return "None";
    }
};

const getSkinByUuid = async (username) => {
    try {
        const uuid = await getUuidByUsername(username);
        const skinByUuidApi = `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/${uuid}`;
        let response = await fetch(skinByUuidApi);
        return response.status === 400 ? `https://visage.surgeplay.com/${config.userSKinTypeInAdminTeam}/512/ec561538f3fd461daff5086b22154bce` : skinByUuidApi;
    } catch (e) {
        console.error("Error fetching skin by UUID:", e);
        return "None";
    }
};

// IP copy only works if you have HTTPS on your website
const copyIp = () => {
    const copyIpButton = document.querySelector(".copy-ip");
    const copyIpAlert = document.querySelector(".ip-copied");

    copyIpButton.addEventListener("click", () => {
        try {
            navigator.clipboard.writeText(config.serverInfo.serverIp);
            copyIpAlert.classList.add("active");
            setTimeout(() => copyIpAlert.classList.remove("active"), 5000);
        } catch (e) {
            console.error("Error copying IP:", e);
            copyIpAlert.innerHTML = "An error has occurred!";
            copyIpAlert.classList.add("active");
            copyIpAlert.classList.add("error");
            setTimeout(() => {
                copyIpAlert.classList.remove("active");
                copyIpAlert.classList.remove("error");
            }, 5000);
        }
    });
};

const setDataFromConfigToHtml = async () => {
    try {
        // Set config data to navbar
        serverName.innerHTML = config.serverInfo.serverName;
        serverLogo.src = `images/${config.serverInfo.serverLogoImageFileName}`;

        // Set config data to header
        serverIp.innerHTML = config.serverInfo.serverIp;

        let locationPathname = location.pathname;

        if (locationPathname === "/" || locationPathname.includes("index")) {
            copyIp();
            // Set config data to header
            serverLogoHeader.src = `images/${config.serverInfo.serverLogoImageFileName}`;
            discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
            minecraftOnlinePlayers.innerHTML = await getMinecraftOnlinePlayer();
        } else if (locationPathname.includes("rules")) {
            copyIp();
        } else if (locationPathname.includes("admin-team")) {
            const atContent = document.querySelector(".at-content");
            for (let team in config.adminTeamPage) {
                const group = document.createElement("div");
                group.classList.add("group", team);
                group.innerHTML = `<h2 class="rank-title">${team.charAt(0).toUpperCase() + team.slice(1)}</h2><div class="users"></div>`;
                atContent.appendChild(group);

                for (let user of config.adminTeamPage[team]) {
                    const groupUsers = group.querySelector(".users");
                    const userDiv = document.createElement("div");
                    userDiv.classList.add("user");
                    let userSkin = user.skinUrlOrPathToFile || await getSkinByUuid(user.inGameName);
                    let rankColor = user.rankColor || config.atGroupsDefaultColors[team];
                    userDiv.innerHTML = `<img src="${userSkin}" alt="${user.inGameName}"><h5 class="name">${user.inGameName}</h5><p class="rank ${team}" style="background: ${rankColor}">${user.rank}</p>`;
                    groupUsers.appendChild(userDiv);
                }
            }
        } else if (locationPathname.includes("contact")) {
            contactForm.action = `https://formsubmit.co/${config.contactPage.email}`;
            discordOnlineUsers.innerHTML = await getDiscordOnlineUsers();
            inputWithLocationAfterSubmit.value = location.href;
        }
    } catch (e) {
        console.error("Error setting data from config to HTML:", e);
    }
};

setDataFromConfigToHtml();
