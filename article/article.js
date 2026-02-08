// ===========================
// AI SUMMARIZER FUNCTIONALITY
// ===========================
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryOutput = document.getElementById("summaryOutput");

summarizeBtn.addEventListener("click", async () => {
    // Show loading state
    summaryOutput.style.display = 'block';
    summaryOutput.innerHTML = '<p class="loading">🧠 Analyzing article content...</p>';
    
    // Disable button during processing
    summarizeBtn.disabled = true;
    summarizeBtn.style.opacity = '0.6';
    summarizeBtn.style.cursor = 'not-allowed';

    // Extract article text (excluding metadata and UI elements)
    const articleContent = document.querySelector(".article-content");
    const paragraphs = Array.from(articleContent.querySelectorAll("p"));
    const fullText = paragraphs.map(p => p.innerText.trim()).join(" ");

    try {
        const summary = await generateSummary(fullText);
        
        // Clean up the summary
        const cleanedSummary = cleanSummaryText(summary);
        
        // Display with animation
        summaryOutput.innerHTML = `
            <p class="fade-in">
                <strong style="color: var(--accent-primary);">📝 AI Summary:</strong><br><br>
                ${cleanedSummary}
            </p>
        `;
    } catch (error) {
        console.error("Summarization error:", error);
        summaryOutput.innerHTML = `
            <p class="fade-in error">
                ❌ Unable to generate summary. Please check your connection and try again.
            </p>
        `;
    } finally {
        // Re-enable button
        summarizeBtn.disabled = false;
        summarizeBtn.style.opacity = '1';
        summarizeBtn.style.cursor = 'pointer';
    }
});

/**
 * Generate summary via backend API
 * @param {string} text - The article text to summarize
 * @returns {Promise<string>} - The generated summary
 */
async function generateSummary(text) {
    const response = await fetch("http://localhost:5000/summarize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.summary || "No summary available.";
}

/**
 * Clean and format the summary text
 * @param {string} summary - Raw summary text
 * @returns {string} - Cleaned summary
 */
function cleanSummaryText(summary) {
    // Remove any repeated loading messages
    let cleaned = summary.replace(/.*Analyzing article content.*/gi, "").trim();
    
    // Limit to first 4-5 sentences for conciseness
    const sentences = cleaned.split(/(?<=[.!?])\s+/);
    const limitedSummary = sentences.slice(0, 4).join(" ");
    
    return limitedSummary || cleaned;
}

// ===========================
// COMMENTS FUNCTIONALITY
// ===========================
let commentCount = 0;

/**
 * Post a new comment
 */
function postComment() {
    const nameInput = document.getElementById('commenter-name');
    const textInput = document.getElementById('comment-text');
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    // Validation
    if (!name || !text) {
        showNotification("Please enter both your name and a comment.", "error");
        return;
    }

    if (text.length < 10) {
        showNotification("Comment must be at least 10 characters long.", "error");
        return;
    }

    // Create comment element
    const comment = document.createElement('div');
    comment.className = 'comment-box fade-in';
    
    const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    comment.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
            <strong style="font-size: 1rem;">${escapeHtml(name)}</strong>
            <span style="color: var(--text-tertiary); font-size: 0.8rem;">${timestamp}</span>
        </div>
        <p style="margin: 0.75rem 0; line-height: 1.6;">${escapeHtml(text)}</p>
        <button class="like-button" onclick="likeComment(this)">
            ❤️ <span class="like-count">0</span>
        </button>
    `;

    // Add to comments container
    const container = document.getElementById('comments-container');
    container.prepend(comment);

    // Update comment count
    commentCount++;
    updateCommentCount();

    // Clear form
    nameInput.value = '';
    textInput.value = '';

    // Show success notification
    showNotification("Comment posted successfully!", "success");

    // Smooth scroll to new comment
    setTimeout(() => {
        comment.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Like a comment
 * @param {HTMLElement} button - The like button element
 */
function likeComment(button) {
    const countSpan = button.querySelector('.like-count');
    const currentCount = parseInt(countSpan.textContent);
    
    // Increment count
    countSpan.textContent = currentCount + 1;
    
    // Add animation
    button.style.transform = 'scale(1.2)';
    button.style.color = '#ff5252';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
    
    // Disable button temporarily to prevent spam
    button.disabled = true;
    setTimeout(() => {
        button.disabled = false;
    }, 1000);
}

/**
 * Update comment count display
 */
function updateCommentCount() {
    const countElement = document.querySelector('.comment-count');
    if (countElement) {
        countElement.textContent = `(${commentCount})`;
    }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===========================
// SHARE FUNCTIONALITY
// ===========================
const shareButtons = document.querySelectorAll('.share-btn');

shareButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const articleTitle = document.querySelector('.article-title').textContent;
        const articleUrl = window.location.href;
        
        switch(index) {
            case 0: // Twitter
                shareOnTwitter(articleTitle, articleUrl);
                break;
            case 1: // Facebook
                shareOnFacebook(articleUrl);
                break;
            case 2: // LinkedIn
                shareOnLinkedIn(articleUrl);
                break;
            case 3: // Copy Link
                copyToClipboard(articleUrl);
                break;
        }
    });
});

function shareOnTwitter(title, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareOnFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
}

function shareOnLinkedIn(url) {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification("Link copied to clipboard!", "success");
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification("Failed to copy link", "error");
    });
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--right-bias)' : 'var(--accent-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// SMOOTH SCROLLING
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// INITIALIZE ON PAGE LOAD
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('NewsHub article page loaded successfully');
    
    // Add hover effect to bias segments
    const biasSegments = document.querySelectorAll('.bias-segment');
    biasSegments.forEach(segment => {
        segment.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-label');
            if (tooltip) {
                this.setAttribute('title', tooltip);
            }
        });
    });
});