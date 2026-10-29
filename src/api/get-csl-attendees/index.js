export default async function handler(req, res) {
  const { slug, max_attendees_count } = req.body.data;

  try {
    let isWaitingListEnabled = false;
    let allAttendees = [];
    let sinceId = null;
    let hasMore = true;

    const apiKey = process.env.CSL_API_KEY;
    const cslPath = process.env.CSL_PATH;

    // CSL attendees endpoint only supports cursor pagination (since_id); `page` returns 400.
    while (hasMore) {
      const query = sinceId ? `?since_id=${sinceId}` : '';
      const response = await fetch(`${cslPath}/api/v1/events/${slug}/attendees${query}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(`CSL attendees request failed (${response.status}): ${body}`);
      }

      const data = await response.json();
      allAttendees = allAttendees.concat(data.attendees || []);
      sinceId = data.meta?.next_since_id;
      hasMore = Boolean(data.meta?.has_more && sinceId);
    }

    const attendeesWithAttendingStatus = allAttendees.filter((attendee) => attendee.attending_status === 'attending');
    if (max_attendees_count && attendeesWithAttendingStatus.length >= max_attendees_count) {
      console.log(
        `Event ${slug} has waiting list enabled. Total attendees: ${attendeesWithAttendingStatus.length}. Max attendees: ${max_attendees_count}`
      );
      isWaitingListEnabled = true;
    }

    return res
      .status(200)
      .json({ isWaitingListActive: isWaitingListEnabled, attendeesCount: attendeesWithAttendingStatus.length });
  } catch (error) {
    console.error(`[get-csl-attendees] ${slug}: ${error.message}`);
    return res.status(502).json({ message: error.message });
  }
}
