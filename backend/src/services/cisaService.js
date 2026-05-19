// src/services/cisaService.js
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

class CisaService {
  /**
   * Fetch the CISA Known Exploited Vulnerabilities catalog.
   * @param {number} limit - Max entries to return (0 = all)
   * @returns {Array<{cve_id: string, title: string, description: string, date: string, reference_url: string, vendor: string, product: string}>}
   */
  async fetchKnownExploitedVulnerabilities(limit = 10) {
    logger.debug(`  🔍 [cisaService] Fetching CISA KEV catalog`);

    const response = await fetch(CISA_KEV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (!response.ok) {
      throw new ApiError(502, `Failed to fetch CISA KEV data: ${response.status}`);
    }

    const json = await response.json();
    const vulnerabilities = json.vulnerabilities || [];
    const total = vulnerabilities.length;

    const results = vulnerabilities.slice(0, limit > 0 ? limit : total).map(vuln => ({
      cve_id: vuln.cveID,
      title: vuln.vulnerabilityName || `${vuln.cveID} - ${vuln.vendorProject} ${vuln.product}`,
      description: vuln.shortDescription || '',
      date: vuln.dateAdded || '',
      vendor: vuln.vendorProject || '',
      product: vuln.product || '',
      required_action: vuln.requiredAction || '',
      reference_url: this._extractReferenceUrl(vuln.notes) || `https://www.cisa.gov/known-exploited-vulnerabilities-catalog`
    }));

    logger.debug(`  ✨ [cisaService] Fetched ${results.length} KEV entries (total: ${total})`);
    return { data: results, total };
  }

  /**
   * Extract a URL from the CISA notes field (often contains NVD/advisory URLs).
   * @param {string} notes
   * @returns {string|null}
   */
  _extractReferenceUrl(notes) {
    if (!notes) return null;
    const urlMatch = notes.match(/https?:\/\/[^\s,;]+/);
    return urlMatch ? urlMatch[0] : null;
  }
}

module.exports = new CisaService();
