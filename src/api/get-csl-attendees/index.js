export default async function handler(req, res) {
  const { slug, max_attendees_count } = req.body.data;

  try {
    let isWaitingListEnabled = false;
    let allAttendees = [];
    let currentPage = 1;
    let totalPages = 0;

    const clientId = process.env.CSL_CLIENT_ID;
    const clientSecret = process.env.CSL_CLIENT_SECRET;
    const cslPath = process.env.CSL_PATH;
    const credentials = `${clientId}:${clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const accessToken = await fetch(`${cslPath}/oauth/token?grant_type=client_credentials`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const receivedToken = await accessToken.json();

    do {
      const response = await fetch(
        `${cslPath}/api/v1/events/${slug}/attendees?access_token=${receivedToken.access_token}&page=${currentPage}`,
        { method: 'GET', headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
      );

      const data = await response.json();
      allAttendees = allAttendees.concat(data.attendees);
      currentPage = data.meta.next_page;
      totalPages = data.meta.total_pages;
    } while (currentPage);

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
    return res.status(200).json({ message: error.message });
  }
}
