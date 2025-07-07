/* eslint-disable no-undef */

// Sample changelog data that would come from git-changelog-manager
window.changelogData = {
	releases: [
		{
			version: '1.2.0',
			date: '2025-01-04',
			summary: 'Major feature release with new dashboard components',
			tag: 'feature',
			changeCount: 12,
			rawContent: `- 🎨 New dashboard layout with improved navigation
- ✨ Added user preferences system
- 🔧 Enhanced search functionality
- 📊 New analytics dashboard
- 🐛 Fixed memory leak in data processing
- 🚀 Performance improvements for large datasets
- 📝 Updated documentation
- 🔒 Enhanced security middleware
- 🎯 Improved error handling
- 💫 Added dark mode support
- 🌐 Internationalization support
- 🧪 Added comprehensive test suite`,
		},
		{
			version: '1.1.3',
			date: '2025-01-02',
			summary: 'Hotfix for critical authentication bug',
			tag: 'hotfix',
			changeCount: 3,
			rawContent: `- 🐛 Fixed critical authentication bypass vulnerability
- 🔒 Enhanced session management
- 📝 Updated security documentation`,
		},
		{
			version: '1.1.2',
			date: '2024-12-28',
			summary: 'Bug fixes and performance improvements',
			tag: 'patch',
			changeCount: 7,
			rawContent: `- 🐛 Fixed pagination issue in user list
- ⚡ Improved database query performance
- 🎨 Fixed UI alignment issues on mobile
- 🔧 Updated dependencies to latest versions
- 📱 Better responsive design
- 🌟 Enhanced loading states
- 💬 Improved error messages`,
		},
		{
			version: '1.1.1',
			date: '2024-12-20',
			summary: 'Minor improvements and documentation updates',
			tag: 'patch',
			changeCount: 5,
			rawContent: `- 📝 Updated API documentation
- 🎨 Minor UI polish
- 🔧 Configuration improvements
- 🧹 Code cleanup and refactoring
- 📦 Updated build process`,
		},
		{
			version: '1.1.0',
			date: '2024-12-15',
			summary: 'New notification system and workflow improvements',
			tag: 'feature',
			changeCount: 15,
			rawContent: `- 🔔 New real-time notification system
- 📋 Enhanced workflow management
- 🎯 Improved task assignment
- 💼 New project templates
- 🔍 Advanced filtering options
- 📊 Enhanced reporting features
- 🎨 UI/UX improvements
- 📱 Mobile app enhancements
- 🔧 Backend optimizations
- 🧪 Expanded test coverage
- 📚 Comprehensive user guides
- 🌍 Multi-language support
- 🔗 Better third-party integrations
- ⚡ Performance optimizations
- 🛡️ Security enhancements`,
		},
		{
			version: '1.0.0',
			date: '2024-12-01',
			summary: 'Initial stable release with core functionality',
			tag: 'major',
			changeCount: 25,
			rawContent: `- 🎉 Initial stable release
- 👥 User management system
- 📝 Project creation and management
- 📋 Task tracking and assignment
- 📊 Basic reporting and analytics
- 🔒 Authentication and authorization
- 📱 Responsive web interface
- 🔄 Real-time updates
- 📁 File upload and management
- 🔍 Search functionality
- 📧 Email notifications
- 🎨 Customizable themes
- 📊 Dashboard widgets
- 🔧 Admin panel
- 📱 Mobile-friendly design
- 🔐 Two-factor authentication
- 📈 Usage analytics
- 🌐 API endpoints
- 📚 Documentation portal
- 🧪 Testing framework
- 🚀 CI/CD pipeline
- 🛡️ Security audit
- 📦 Deployment automation
- 🔄 Database migrations
- 🎯 Performance monitoring`,
		},
	],
	stats: {
		totalReleases: 6,
		totalChanges: 67,
		latestVersion: '1.2.0',
	},
};

// Changelog Vue Component - Modern card-based interface with search and filtering
// Note: The theme toggle button is outside the Vue app in HTML and works via the global
// vanilla handler. However, if you need Vue-aware theme functionality within components,
// you can access window.vueApp.themeIsDark and window.vueApp.toggleTheme()
const changelogManager = {
	setup() {
		// Destructure Vue composition API functions
		const { ref, computed, onMounted } = Vue;

		// Get data from window object
		const initialData = window.changelogData || { releases: [], stats: {} };

		// Reactive data
		const releases = ref(initialData.releases || []);
		const stats = ref(initialData.stats || {});
		const searchTerm = ref('');
		const sortBy = ref('date');
		const isLoading = ref(false);
		const selectedRelease = ref(null);
		const showModal = ref(false);
		const viewMode = ref('grid'); // Add view mode state

		// Load app name from package.json and populate sidebar on mount
		onMounted(async () => {
			await loadAppName();
			populateSidebar();
			updateSidebarStats();
		});

		// Load app name from package.json
		const loadAppName = async () => {
			try {
				const response = await fetch('./package.json');
				if (response.ok) {
					const packageData = await response.json();
					const appName = packageData.name
						.split('-')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');

					const titleElement = document.getElementById('appTitle');
					if (titleElement) {
						titleElement.textContent = `${appName} Release Notes`;
					}
				}
			} catch (error) {
				console.warn('Could not load package.json:', error);
				// Fallback to default name if package.json can't be loaded
			}
		};

		const updateSidebarStats = () => {
			document.getElementById('totalReleases').textContent =
				releases.value.length;
			document.getElementById('totalChanges').textContent =
				stats.value.totalChanges || 0;
		};

		const populateSidebar = () => {
			const sidebarContainer = document.getElementById('sidebarReleases');
			if (!sidebarContainer) return;

			// Group releases by month
			const releasesByMonth = {};
			releases.value.forEach((release) => {
				const date = new Date(release.date);
				const monthKey = `${date.getFullYear()}-${String(
					date.getMonth() + 1
				).padStart(2, '0')}`;
				const monthName = date.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
				});

				if (!releasesByMonth[monthKey]) {
					releasesByMonth[monthKey] = {
						name: monthName,
						releases: [],
					};
				}
				releasesByMonth[monthKey].releases.push(release);
			});

			// Sort months by date (newest first)
			const sortedMonths = Object.keys(releasesByMonth).sort((a, b) =>
				b.localeCompare(a)
			);

			sidebarContainer.innerHTML = `
                <div class="sidebar-section">
                    <h3>📅 Releases by Month</h3>
                    <div class="sidebar-summary">
                        <span class="total-releases">${
													releases.value.length
												} total releases</span>
                    </div>
                    <div class="release-groups">
                        ${sortedMonths
													.map((monthKey) => {
														const monthData = releasesByMonth[monthKey];
														const isCurrentMonth =
															monthKey === new Date().toISOString().slice(0, 7);
														return `
                                    <details class="month-group" ${
																			isCurrentMonth ? 'open' : ''
																		}>
                                        <summary class="month-summary">
                                            <span class="month-name">${
																							monthData.name
																						}</span>
                                            <span class="month-count">${
																							monthData.releases.length
																						} releases</span>
                                        </summary>
                                        <div class="month-releases">
                                            ${monthData.releases
																							.map(
																								(release) => `
                                            <a href="#${
																							release.version
																						}" class="release-link" onclick="scrollToRelease('${
																									release.version
																								}')">
                                                <div class="release-version">${
																									release.version
																								}</div>
                                                <div class="release-date">${formatDate(
																									release.date
																								)}</div>
                                            </a>
                                        `
																							)
																							.join('')}
                                        </div>
                                    </details>
                                `;
													})
													.join('')}
                    </div>
                </div>
            `;
		};

		// Computed properties
		const filteredReleases = computed(() => {
			let filtered = releases.value.filter((release) => {
				if (!searchTerm.value) return true;

				const searchLower = searchTerm.value.toLowerCase();
				return (
					release.version.toLowerCase().includes(searchLower) ||
					release.summary.toLowerCase().includes(searchLower) ||
					release.rawContent.toLowerCase().includes(searchLower)
				);
			});

			// Sort releases
			filtered.sort((a, b) => {
				switch (sortBy.value) {
					case 'version':
						return version_compare(b.version, a.version);
					case 'date':
						return new Date(b.date) - new Date(a.date);
					case 'changes':
						return b.changeCount - a.changeCount;
					default:
						return 0;
				}
			});

			return filtered;
		});

		const displayStats = computed(() => ({
			showing: filteredReleases.value.length,
			total: releases.value.length,
			totalChanges: stats.value.totalChanges || 0,
			latestVersion: stats.value.latestVersion || 'Unknown',
		}));

		// Methods
		const version_compare = (a, b) => {
			const aParts = a.split('.').map(Number);
			const bParts = b.split('.').map(Number);

			for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
				const aPart = aParts[i] || 0;
				const bPart = bParts[i] || 0;

				if (aPart !== bPart) {
					return aPart - bPart;
				}
			}
			return 0;
		};

		const formatDate = (dateString) => {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			});
		};

		const getVersionIcon = (version) => {
			const parts = version.split('.');
			const major = parseInt(parts[0]) || 0;
			const minor = parseInt(parts[1]) || 0;
			const patch = parseInt(parts[2]) || 0;

            if (major > 0) return 'ph ph-rocket-launch';
            if (minor > 0) return 'ph ph-star';
            if (patch > 50) return 'ph ph-medal';
            return 'ph ph-tag';
		};

		const getChangesSummary = (content) => {
			const lines = content.split('\n');
			const changes = lines.filter(
				(line) => line.trim().startsWith('- ') || line.trim().startsWith('* ')
			);
			return changes
				.slice(0, 3)
				.map((line) => line.replace(/^[\s\-*]+/, '').trim());
		};

		const openReleaseModal = (release) => {
			selectedRelease.value = release;
			showModal.value = true;
		};

		const closeModal = () => {
			showModal.value = false;
			selectedRelease.value = null;
		};

		const viewReleaseDetails = (release) => {
			openReleaseModal(release);
		};

		return {
			releases,
			stats,
			searchTerm,
			sortBy,
			isLoading,
			selectedRelease,
			showModal,
			viewMode,
			filteredReleases,
			displayStats,
			formatDate,
			getVersionIcon,
			getChangesSummary,
			openReleaseModal,
			closeModal,
			viewReleaseDetails,
			populateSidebar,
		};
	},
	template: `
        <div class="changelog-container">
            <!-- View Toggle Buttons -->
            <div class="view-controls">
                <div class="view-toggles">
                    <button 
                        class="toggle-btn" 
                        :class="{ active: viewMode === 'grid' }"
                        @click="viewMode = 'grid'"
                    >
                        <i class="ph ph-duotone ph-squares-four"></i>
                        Grid
                    </button>
                    <button 
                        class="toggle-btn" 
                        :class="{ active: viewMode === 'list' }"
                        @click="viewMode = 'list'"
                    >
                        <i class="ph ph-duotone ph-list"></i>
                        List
                    </button>
                </div>
            </div>

            <!-- Search and Filter Bar -->
            <div class="filter-bar">
                <div class="filter-left">
                    <div class="search-box">
                        <i class="ph ph-duotone ph-magnifying-glass"></i>
                        <input 
                            type="text" 
                            v-model="searchTerm" 
                            placeholder="Search releases..."
                            class="search-input"
                        />
                    </div>
                </div>
                <div class="filter-right">
                    <div class="sort-dropdown">
                        <label for="sortSelect">Sort by:</label>
                        <select id="sortSelect" v-model="sortBy">
                            <option value="date">Date</option>
                            <option value="version">Version</option>
                            <option value="changes">Changes</option>
                        </select>
                    </div>
                    <div class="results-count">
                        Showing {{ displayStats.showing }} of {{ displayStats.total }} releases
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-bar">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="ph ph-duotone ph-chart-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ displayStats.total }}</div>
                        <div class="stat-label">Total Releases</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="ph ph-duotone ph-list-bullets"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ displayStats.totalChanges }}</div>
                        <div class="stat-label">Total Changes</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="ph ph-duotone ph-rocket-launch"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">{{ displayStats.latestVersion }}</div>
                        <div class="stat-label">Latest Version</div>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading releases...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredReleases.length === 0" class="empty-state">
                <div class="empty-icon">
                    <i class="ph ph-duotone ph-file-text"></i>
                </div>
                <h3>No releases found</h3>
                <p v-if="searchTerm">Try adjusting your search criteria</p>
                <p v-else>No releases have been published yet</p>
            </div>

            <!-- Releases Grid -->
            <div v-else-if="viewMode === 'grid'" class="releases-grid">
                <div 
                    v-for="release in filteredReleases" 
                    :key="release.version"
                    :id="release.version"
                    class="release-card"
                    @click="openReleaseModal(release)"
                >
                    <div class="release-header">
                        <div class="release-icon">
                            <i :class="getVersionIcon(release.version)"></i>
                        </div>
                        <div class="release-info">
                            <h3 class="release-version">{{ release.version }}</h3>
                            <p class="release-date">{{ formatDate(release.date) }}</p>
                        </div>
                        <div class="release-tag">
                            <span class="tag-label">{{ release.tag }}</span>
                        </div>
                    </div>
                    
                    <div class="release-body">
                        <div class="release-summary">
                            <p>{{ release.summary }}</p>
                        </div>
                    </div>
                    
                    <div class="release-footer">
                        <div class="release-stats">
                            <span class="stat-item">
                                <i class="ph ph-duotone ph-list-bullets"></i>
                                {{ release.changeCount }} changes
                            </span>
                            <span class="stat-item">
                                <i class="ph ph-duotone ph-calendar"></i>
                                {{ formatDate(release.date) }}
                            </span>
                        </div>
                        <div class="release-actions">
                            <button class="action-btn primary" @click="viewReleaseDetails(release)">
                                <i class="ph ph-duotone ph-arrow-right"></i>
                                View Release
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Releases List -->
            <div v-else-if="viewMode === 'list'" class="releases-list">
                <div 
                    v-for="release in filteredReleases" 
                    :key="release.version"
                    :id="release.version"
                    class="release-row"
                    @click="openReleaseModal(release)"
                >
                    <div class="release-list-header">
                        <div class="release-icon">
                            <i :class="getVersionIcon(release.version)"></i>
                        </div>
                        <div class="release-info">
                            <h3 class="release-version">{{ release.version }}</h3>
                            <p class="release-summary">{{ release.summary }}</p>
                        </div>
                        <div class="release-meta">
                            <span class="release-date">{{ formatDate(release.date) }}</span>
                            <span class="release-changes">{{ release.changeCount }} changes</span>
                            <span class="release-tag">{{ release.tag }}</span>
                        </div>
                        <div class="release-actions">
                            <button class="action-btn primary" @click="viewReleaseDetails(release)">
                                <i class="ph ph-duotone ph-arrow-right"></i>
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Release Modal -->
            <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">{{ selectedRelease?.version }}</h2>
                        <button class="modal-close" @click="closeModal">
                            <i class="ph ph-duotone ph-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="release-detail">
                            <div class="release-meta">
                                <div class="meta-item">
                                    <i class="ph ph-duotone ph-calendar"></i>
                                    {{ formatDate(selectedRelease?.date) }}
                                </div>
                                <div class="meta-item">
                                    <i class="ph ph-duotone ph-list-bullets"></i>
                                    {{ selectedRelease?.changeCount }} changes
                                </div>
                                <div class="meta-item">
                                    <i class="ph ph-duotone ph-tag"></i>
                                    {{ selectedRelease?.tag }}
                                </div>
                            </div>
                            <div class="release-content">
                                <div class="release-summary">
                                    <p>{{ selectedRelease?.summary }}</p>
                                </div>
                                <div class="markdown-content" v-html="formatMarkdown(selectedRelease?.rawContent)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
	methods: {
		formatMarkdown(content) {
			if (!content) return '';

			// Simple markdown-like formatting
			return content
				.split('\n')
				.map((line) => {
					if (line.trim().startsWith('- ')) {
						return `<li>${line.trim().substring(2)}</li>`;
					}
					return line;
				})
				.join('\n')
				.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
		},
	},
};

// Helper function for sidebar navigation
window.scrollToRelease = function (version) {
	const element = document.getElementById(version);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		// Briefly highlight the card
		element.style.transform = 'scale(1.02)';
		element.style.borderColor = 'var(--c-accent)';
		setTimeout(() => {
			element.style.transform = '';
			element.style.borderColor = '';
		}, 1000);
	}
};

// Theme Management Logic
(function() {
  const STORAGE_KEY = 'prefers-dark';
  const body = document.body;
  const toggleBtn = document.getElementById('themeToggle');

  // Make applyTheme globally accessible for Vue integration
  window.applyTheme = (dark) => {
    if (dark) {
      body.classList.add('mode-dark');
      body.classList.remove('light-active');
      toggleBtn?.classList.add('dark');
    } else {
      body.classList.remove('mode-dark');
      body.classList.add('light-active');
      toggleBtn?.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, dark ? '1' : '0');
    
    // Notify Vue app of theme change if it exists
    if (window.vueApp && window.vueApp.themeIsDark) {
      window.vueApp.themeIsDark.value = dark;
    }
  };

  // initial load
  const saved = localStorage.getItem(STORAGE_KEY);
  const initialDark = saved === null ? true : saved === '1';
  window.applyTheme(initialDark);

  // wait for DOM then hook click
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        window.applyTheme(!body.classList.contains('mode-dark'));
      });
    }
  });
})();

// Debug: Log when Vue app is being initialized
console.log('Changelog script loaded');
console.log('Window changelogData:', window.changelogData);

// Initialize Vue app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	// Check if Vue is available
	if (typeof Vue === 'undefined') {
		console.error(
			'Vue.js is not loaded. Make sure Vue CDN is included in the page.'
		);
		return;
	}

	// Check if target element exists
	const targetElement = document.getElementById('changelogApp');
	if (!targetElement) {
		console.error('Target element #changelogApp not found');
		return;
	}

	try {
		const { createApp, ref } = Vue;

		// Get initial theme state
		const STORAGE_KEY = 'prefers-dark';
		const saved = localStorage.getItem(STORAGE_KEY);
		const initialDark = saved === null ? true : saved === '1';

		const app = createApp({
			setup() {
				// Reactive theme state
				const themeIsDark = ref(initialDark);

				// Theme toggle function that calls the global applyTheme
				const toggleTheme = () => {
					if (typeof window.applyTheme === 'function') {
						window.applyTheme(!themeIsDark.value);
					}
				};

				// Expose theme state and toggle function globally for consistency
				window.vueApp = {
					themeIsDark,
					toggleTheme
				};

				return {
					themeIsDark,
					toggleTheme
				};
			},
			components: {
				'changelog-manager': changelogManager,
			},
		});

		app.mount('#changelogApp');
	} catch (error) {
		console.error('Error mounting Vue app:', error);
	}
});
