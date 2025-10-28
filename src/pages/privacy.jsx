import React from "react";
import styled from "@emotion/styled";
import Layout from "../components/Layout";
import HelmetComponent from "../components/HelmetComponent";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.6;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #333;
  }

  h2 {
    font-size: 1.8rem;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #444;
  }

  h3 {
    font-size: 1.4rem;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #555;
  }

  p {
    margin-bottom: 15px;
    color: #666;
  }

  ul {
    margin-bottom: 15px;
    padding-left: 30px;
  }

  li {
    margin-bottom: 8px;
    color: #666;
  }

  a {
    color: #1976d2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .last-updated {
    font-style: italic;
    color: #999;
    margin-bottom: 30px;
  }

  .contact-info {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-top: 30px;
  }
`;

function Privacy() {
  return (
    <Layout>
      <HelmetComponent
        title="Privacy Policy - ServyDoor"
        description="Privacy Policy for ServyDoor - Learn how we collect, use, and protect your personal information."
      />
      <Container>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: October 28, 2025</p>

        <p>
          Welcome to ServyDoor. We respect your privacy and are committed to
          protecting your personal data. This privacy policy explains how we
          collect, use, and safeguard your information when you use our service.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <ul>
          <li>Account information (email address, account name)</li>
          <li>Profile information (avatar, if provided via Google OAuth)</li>
          <li>Reading sessions and book-related data</li>
          <li>Bookmarks and reading preferences</li>
          <li>Word definitions and notes you create</li>
        </ul>

        <h3>1.2 Information Collected Automatically</h3>
        <ul>
          <li>Usage data and analytics</li>
          <li>Device information and browser type</li>
          <li>IP address and location data</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h3>1.3 Third-Party Information</h3>
        <ul>
          <li>
            Google OAuth: When you sign in with Google, we receive your Google
            profile information (name, email, profile picture) as permitted by
            your Google account settings
          </li>
          <li>
            Google Books API: Book information and metadata from Google Books
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Create and manage your account</li>
          <li>Personalize your reading experience</li>
          <li>Store your reading sessions, bookmarks, and notes</li>
          <li>Authenticate your identity via Google OAuth</li>
          <li>Send you important service updates and notifications</li>
          <li>Analyze usage patterns to improve our service</li>
          <li>Prevent fraud and ensure security</li>
        </ul>

        <h2>3. Data Sharing and Disclosure</h2>
        <p>We do not sell your personal information. We may share data:</p>
        <ul>
          <li>
            <strong>With Service Providers:</strong> Third-party services that
            help us operate our platform (hosting, analytics, authentication)
          </li>
          <li>
            <strong>For Legal Reasons:</strong> When required by law or to
            protect our rights
          </li>
          <li>
            <strong>With Your Consent:</strong> When you explicitly authorize us
            to share information
          </li>
        </ul>

        <h2>4. Third-Party Services</h2>
        <p>We integrate with the following third-party services:</p>
        <ul>
          <li>
            <strong>Google OAuth:</strong> For secure authentication (
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </a>
            )
          </li>
          <li>
            <strong>Google Books API:</strong> For book information and metadata
          </li>
          <li>
            <strong>Hosting Services:</strong> Render.com for server hosting
          </li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal data, including:
        </p>
        <ul>
          <li>Encrypted connections (HTTPS/SSL)</li>
          <li>Secure authentication using JWT tokens</li>
          <li>Password hashing with bcrypt</li>
          <li>Regular security updates and monitoring</li>
        </ul>

        <h2>6. Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>
            <strong>Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Correction:</strong> Update or correct your information
          </li>
          <li>
            <strong>Deletion:</strong> Request deletion of your account and data
          </li>
          <li>
            <strong>Portability:</strong> Export your data in a structured
            format
          </li>
          <li>
            <strong>Opt-Out:</strong> Unlink your Google account at any time
          </li>
        </ul>

        <h2>7. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to improve your experience.
          You can control cookie settings through your browser preferences.
          Essential cookies required for authentication cannot be disabled.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our service is not intended for users under 13 years of age. We do not
          knowingly collect personal information from children. If you believe
          we have collected information from a child, please contact us
          immediately.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place for
          such transfers.
        </p>

        <h2>10. Data Retention</h2>
        <p>
          We retain your personal data for as long as your account is active or
          as needed to provide services. You may request deletion of your
          account and associated data at any time.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify
          you of significant changes by posting the new policy on this page and
          updating the "Last Updated" date.
        </p>

        <h2>12. Contact Us</h2>
        <div className="contact-info">
          <p>
            If you have questions or concerns about this privacy policy or our
            data practices, please contact us:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:privacy@servydoor.com">privacy@servydoor.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="https://servydoor.com">https://servydoor.com</a>
          </p>
        </div>

        <h2>13. California Privacy Rights (CCPA)</h2>
        <p>
          If you are a California resident, you have additional rights under the
          California Consumer Privacy Act (CCPA), including:
        </p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to know if personal information is sold or disclosed</li>
          <li>Right to opt-out of the sale of personal information</li>
          <li>Right to deletion of personal information</li>
          <li>Right to non-discrimination for exercising CCPA rights</li>
        </ul>

        <h2>14. EU Privacy Rights (GDPR)</h2>
        <p>
          If you are located in the European Economic Area (EEA), you have
          rights under the General Data Protection Regulation (GDPR), including:
        </p>
        <ul>
          <li>Right to access your personal data</li>
          <li>Right to rectification of inaccurate data</li>
          <li>Right to erasure ("right to be forgotten")</li>
          <li>Right to restrict processing</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
          <li>Right to withdraw consent</li>
        </ul>

        <p
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          By using ServyDoor, you acknowledge that you have read and understand
          this Privacy Policy and agree to its terms.
        </p>
      </Container>
    </Layout>
  );
}

export default Privacy;
