import { notify } from "./notify";

//Shortcut Creation Code
// Define the createShortcut function
export async function createShortcut(game: any) {
    const { appid, appname, exe, StartDir, LaunchOptions, CompatTool, Grid, WideGrid, Hero, Logo } = game;
  
    // Separate the executable path and arguments
    const match = exe.match(/"([^"]+)"/);
    if (!match) {
      throw new Error(`Invalid exe format: ${exe}`);
    }
  
    const formattedStartDir = StartDir.replace(/"/g, '');
    const launchOptions = LaunchOptions.split(" ").slice(1).join(" ");
  
    console.log(`Creating shortcut ${appname}`);
    console.log(`Game details: Name= ${appname}, ID=${appid}, exe=${exe}, StartDir=${formattedStartDir}, launchOptions=${launchOptions}`);
  
    // Use the addShortcut method directly
    const appId = await SteamClient.Apps.AddShortcut(appname, exe, formattedStartDir, launchOptions);
    if (appId) {
      notify.toast("New Shortcut Created",`${appname} has been added to your library!`)
      console.log(`AppID for ${appname} = ${appId}`);
      SteamClient.Apps.SetShortcutName(appId, appname);
      SteamClient.Apps.SetAppLaunchOptions(appId, LaunchOptions)
      SteamClient.Apps.SetShortcutExe(appId, exe)
      SteamClient.Apps.SetShortcutStartDir(appId,StartDir)
      if (CompatTool != false) {
        SteamClient.Apps.SpecifyCompatTool(appId,CompatTool)
      }
      SteamClient.Apps.SetCustomArtworkForApp(appId,Hero,'png',1)
      SteamClient.Apps.SetCustomArtworkForApp(appId,Logo,'png',2)
      SteamClient.Apps.SetCustomArtworkForApp(appId,Grid,'png',0)
      SteamClient.Apps.SetCustomArtworkForApp(appId,WideGrid,'png',3)
      SteamClient.Apps.AddUserTagToApps([appId], "NonSteamLaunchers")
      return true;
    } else {
      console.log(`Failed to create shortcut for ${appname}`);
      return false;
    }
  }
  //End of Shortcut Creation Code