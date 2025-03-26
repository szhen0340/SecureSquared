export function scanResume(fileContent: string) {
    const createZeroWidthPattern = (text: string) => {
        const zwChars = '[\u200B-\u200F\uFEFF]*';
        return new RegExp(text.split('').join(zwChars));
      };
      
      const hiddenBypassRegex = createZeroWidthPattern('HIDDEN_BYPASS');
      const flag = "FLAG{Z3R0_W1DTH_BYPA55_D3T3CT3D}";
    
      if (hiddenBypassRegex.test(fileContent)) {
        return { success: true, flag: flag };
      }
  
    const keywords = ["machine learning", "security", "artificial intelligence", "python"];
    const score = keywords.reduce((count, keyword) => 
      count + (fileContent.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length, 0);
  
    if (score > 5) {
      return { success: true, message: "Your application has been received. We'll be in touch soon." };
    } else {
      return { success: false, message: "Thank you for your interest, but your qualifications don't match our requirements." };
    }
  }
  