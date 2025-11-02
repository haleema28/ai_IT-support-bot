const baseURL = "http://localhost:5000/api";

const sampleContent = [
  {
    title: "Password Reset Procedures",
    text: "If you need to reset your password, please visit the employee portal at portal.company.com. Click on \"Forgot Password\" link and enter your email address. You will receive a password reset link within 5 minutes. If you don't receive the email, check your spam folder. The password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters. Passwords expire every 90 days for security purposes."
  },
  {
    title: "VPN Troubleshooting Guide",
    text: "When connecting to VPN fails, first check your internet connection. Make sure you're using the correct VPN server address: vpn.company.com. Try disconnecting and reconnecting. If the issue persists, clear your browser cache or restart the VPN client application. For Windows users, ensure the VPN service is running in Services. For Mac users, check System Preferences for VPN status. If you receive an authentication error, verify your username and password are correct. Contact IT support if problems continue after these steps."
  },
  {
    title: "Outlook Email Configuration",
    text: "To set up Outlook email on your computer, open Outlook and select File > Add Account. Enter your full email address and password. For incoming mail server, use mail.company.com with port 993 for IMAP or 995 for POP3. For outgoing mail server, use smtp.company.com with port 587. Enable SSL/TLS encryption for both servers. Make sure \"Remember password\" is checked. If you encounter sync issues, go to Account Settings > Change and test the account settings. Outlook typically syncs every 30 minutes automatically."
  },
  {
    title: "Common Printer Problems and Solutions",
    text: "If your printer is not responding, first check that it's turned on and connected to the network or computer. Verify the printer has paper and ink or toner. Try printing a test page from the printer's control panel. If printing fails, check if the printer appears in your computer's printer list. For network printers, ensure you're connected to the same Wi-Fi network. Clear any print queue errors in the printer settings. Restart the print spooler service if needed. For wireless printers, try reconnecting to the network. If the printer shows offline status, set it as default and check printer properties."
  },
  {
    title: "Troubleshooting Network Connectivity",
    text: "If you cannot connect to the internet or company network, check your network cable connection first. Ensure the cable is firmly plugged into both your computer and the network port or router. For wireless connections, verify you're connected to the correct Wi-Fi network. Try forgetting and reconnecting to the network. Restart your network adapter in Device Manager. Run network diagnostics by right-clicking the network icon and selecting \"Troubleshoot problems\". Check if other devices on the same network are working. If you're using a VPN, disconnect it temporarily to test basic connectivity. Contact IT if the issue affects multiple devices or persists after troubleshooting."
  },
  {
    title: "Improving Laptop Performance",
    text: "If your laptop is running slowly, first restart it to clear temporary files. Check available disk space - ensure at least 10% of your hard drive is free. Close unnecessary applications and browser tabs. Run disk cleanup utility to remove temporary files. Check Task Manager for programs using high CPU or memory. Uninstall unused applications. Update your operating system and drivers. Disable startup programs that you don't need. Increase virtual memory if you have low RAM. Consider adding more RAM if problems persist. For persistent slowness, contact IT support for a hardware check or reimage."
  }
];

async function addSampleKB() {
  console.log("📚 Adding sample knowledge base content...\n");
  
  for (let i = 0; i < sampleContent.length; i++) {
    const content = sampleContent[i];
    try {
      const response = await fetch(`${baseURL}/kb/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Added: ${content.title} (${data.chunks} chunks)`);
      } else {
        console.error(`❌ Failed to add "${content.title}":`, data.error || data.message);
      }
    } catch (error) {
      console.error(`❌ Failed to add "${content.title}":`, error.message);
    }
  }
  
  console.log("\n✨ Done! You can now test the chatbot.");
  console.log("\nTest with queries like:");
  console.log("  - \"How do I reset my password?\"");
  console.log("  - \"I can't connect to VPN\"");
  console.log("  - \"My printer is not working\"");
  console.log("  - \"My laptop is running slow\"");
}

addSampleKB().catch(console.error);


